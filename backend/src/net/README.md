# net — 网络层（帧编解码 + 网关 + C2S 解密）

本目录负责**线格式编解码**、**C2S 密文解密**、**帧记录**与**自研 WebSocket 网关**；并把 C2S 转给
路由层（`../messages/MessageRouter2`）产出 S2C 帧。

> 协议事实详见各模块注释；本目录实现复刻参考网关 `gateway.py` 的 `build_msg` / `parse_plain` / `_wrap_dynproto`。

---

## 文件清单

| 文件 | 职责 |
|---|---|
| `FrameCodec.ts` | 线格式编解码：`buildS2C` / `parsePlain` / `wrapDynProto` / `wrapDynProtoAuto` / `unwrapDynProto` / `buildConnectionAccepted` |
| `WsGateway.ts` | 自研 RFC6455 WebSocket 网关（零依赖）：握手回显 `xj`、下发 msg1、读帧反掩、C2S 解密后回调路由 |
| `C2SCrypto.ts` | C2S 密文解密（脱离 Frida 的关键）：恢复 frame key → `DecodedC2S{ msgId, order, body }` |
| `c2s_tables.ts` | C2S 加密所需的查表常量（`C2S_T1` / `C2S_T2INV` / `C2S_HASH`） |
| `FrameRecorder.ts` | 全量帧记录到 `logs/gw_*.jsonl`（镜像参考网关 captures） |
| `IHandle.ts` | 应答器契约：`IHandle<REQ, REP> { reqId, recId, Handle(req): REP }` |
| `MessageControllerBase.ts` | `AutoResponser: Record<MESSAGE_ID, IHandleBase>` 容器基类 |
| `msg/` | **自动生成**的应答器集合（`MessageController` + `NetMsg_*.ts`），见 [`messages/README`](../messages/README.md) |
| `msg_mod/` | `MessageControllerMod`：应答器的可扩展/追加点（心跳、逻辑重连） |

> 旧的 `OrderTracker.ts` / `PlainChannel.ts` 已删除。order/明文侧信道逻辑不再使用：
> C2S 直接由 `WsGateway` 解密后走同一路由。

---

## FrameCodec — 帧格式（★实证，曾纠正误区）

```
S2C(WS 上) / C2S 明文(UDP) :
  [bodyLen u32 LE][order u32 LE][msgId u16 LE][body]    (10B 头)
  ★bodyLen 含 msgId 2B：body 实际字节数 = bodyLen - 2，body 从字节 10 起、到 8 + bodyLen 止。
C2S 真实(WS 上, 加密后)：
  [msgId u16 LE][2B 保留][order u32 LE][body]           (8B 头，密文，本服务不解密即不识)
dynproto 包裹:
  [4B 零][4B LE 长度][pbuf]，小体补零到 28B
```

- `buildS2C(msgId, order, body)` → S2C 字节（10B 头，**bodyLen 含 msgId**）+ body。
- `parsePlain(buf)` → `{ msgId, order, body }`，失败返回 `null`。
- `wrapDynProto(pbuf, tiny)` / `wrapDynProtoAuto(pbuf)`：业务 protobuf 外套 dynproto 头。
- `unwrapDynProto(body)`：S2C body 拆出内部 protobuf（去 8B 头）。
- `buildConnectionAccepted()`：连接建立后主动下发 `msgId=1, order=0` 空体帧。

> ⚠️ **两个曾踩的坑（后续接手务必注意）**：
> 1. **bodyLen 必须含 msgId 2B**。曾误写成「不含 msgId 的 body 长度」，导致客户端把 body 末尾
>    裁掉 2B、protobuf 截断 → 能解出 MSG ID 却解不出 MsgBody（2026-08-28 实证，已修复）。
> 2. **dynproto 空体** = 8B `00000000 00000000`（4B 头=0 + 4B len=0）；若补零成 28B 全零，
>    客户端判 `MsgBodyExists=False` 拒读，主界面初始化静默卡死（2026-08-24 实证）。

---

## WsGateway — 自研 RFC6455（零依赖）

职责：
1. TCP 手搓 WS 握手，**必须回显**客户端 `Sec-WebSocket-Protocol`（真实客户端发 `xj`）。
2. 连接后主动下发 `buildConnectionAccepted()`（msg1）。
3. 读客户端帧：处理 `close(0x8)` / `ping(0x9)`(→pong) / `pong(0xa)`；数据帧（0x1/0x2）为
   **C2S 密文**，反掩后 `record('C2S')` → `decryptC2S` → `onC2S(connId, {msgId, order, body})` 路由。
4. `sendS2C(frame)` 把 S2C 帧下发到「活跃连接」（经 `buildS2C` 加 10B 头）。
5. server→client 帧 `FIN=1`、**不加 mask**。

对外 API：
```ts
class WsGateway extends Server {
  setOnC2S(cb: (connId: string, frame: DecodedC2S) => S2CFrame[]): void;
  sendS2C(frame: S2CFrame): void;   // 经活跃连接下发 S2C
  getActiveConnId(): string;
}
```

---

## C2SCrypto — C2S 密文解密（脱离 Frida 的关键）

加密链（2026-08-24 实证，20/20 帧恢复成功）：
```
EncodeBuffer 输入 = plain ^ keybe循环；EncodeBuffer(key, add=1): K=key+C2S_HASH
  buf[i] ^= T1[(K+i)&0x3FF]；buf[i] = T2[buf[i]] - (K&0xFF)
WS 密文 = Encode(plain ^ keybe) ^ keybe   →   plain = Decode(ws ^ keybe) ^ keybe
```
`decryptC2S(ws)` 扫描 `bodyLen × K&0x3FF` 解出每帧 32 位 key，自洽校验 + `KNOWN_MSG_IDS` 白名单防误报，
返回 `DecodedC2S{ msgId, order, body }`。解密后的明文帧即 `[bodyLen含msgId][order][msgId][body]` 形式。

---

## 设计要点

- **零运行时依赖**：WS 协议、帧解析、protobuf 全手搓，最大化打包/Docker 健壮性。
- **C2S 解密直读**：不再依赖 Frida 明文侧信道；`WsGateway` 直接把线上密文解密→路由→应答。
- **帧记录镜像**：`FrameRecorder` 输出 `logs/gw_YYYYMMDD.jsonl`（含 ts/conn/dir/len/hex/ascii），用于离线比对客户端日志。