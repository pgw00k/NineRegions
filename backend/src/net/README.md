# net — 网络层（帧编解码 + 网关 + 明文侧信道）

本目录负责**线格式编解码**、**S2C order 跟踪**、**帧记录**，以及两个独立可启动的网络组件：
**自研 WebSocket 网关**（`WsGateway`）与 **Frida 明文侧信道**（`PlainChannel`）。

> 协议事实详见根目录 [`Note.md`](../../Note.md) 第 2 节。本目录所有实现均复刻参考网关 `gateway.py`。

---

## 文件清单

| 文件 | 职责 |
|---|---|
| `FrameCodec.ts` | 线格式编解码：`buildS2C` / `parsePlain` / `wrapDynProto` / `wrapDynProtoAuto` / `unwrapDynProto` / `buildConnectionAccepted` |
| `OrderTracker.ts` | 逐连接 S2C `order` 严格递增（逻辑消息）+ 内部消息回显 |
| `FrameRecorder.ts` | 全量帧记录到 `logs/gw_*.jsonl`（镜像参考网关 captures）|
| `WsGateway.ts` | 自研 RFC6455 WebSocket 网关（零依赖）|
| `PlainChannel.ts` | UDP :9002 接收 Frida 明文帧并路由 |

---

## FrameCodec — 帧格式（★实证，曾纠正误区）

```
S2C（WS 上）:      [bodyLen u32 LE][order u32 LE][msgId u16 LE][body]   (10B 头)
C2S 明文（UDP）:   [bodyLen u32 LE][order u32 LE][msgId u16 LE][body]   (10B 头，bodyLen 含 msgId 2B)
C2S 真实（WS 上）: [msgId u16 LE][2B 保留][order u32 LE][body]          (8B 头，加密，本服务不解析)
dynproto 包裹:     [4B 零][4B LE 长度][pbuf]，小体补零到 28B
```

- `buildS2C(msgId, order, body)` → S2C 字节（10B 头 + body）。
- `parsePlain(buf)` → `{ msgId, order, body }`，失败返回 `null`（用于 UDP 明文）。
- `wrapDynProto(pbuf, tiny)`：业务 protobuf 外套 dynproto 头；`tiny=true` 补零到 28B。
- `wrapDynProtoAuto(pbuf)`：pbuf ≤ 20B 自动选 tiny，否则 long（对应 `gateway.py` 的 `_wrap_dynproto` / `_wrap_dynproto_long`）。
- `unwrapDynProto(body)`：从 S2C body 拆出内部 protobuf 字节（去 8B 头），供需要解析客户端请求体时使用。
- `buildConnectionAccepted()`：连接建立后主动下发的 `msgId=1, order=0` 空体帧。

> ⚠️ **内部消息（1/2/3/4/7）的 body 为空、不包 dynproto**；逻辑消息（≥10000）**必须包 dynproto**，否则客户端 `ReadProtoBufDynamic` 解不出。

---

## OrderTracker — order 规则

客户端 `MCNetManager.OnSetOrder` 校验 `order - logicOrder == 1`（严格递增 1）；回显相同 order 会被 `drop invalid package`。

- 内部消息（1/2/3/4/7）：回显 `reqOrder`。
- 逻辑消息（≥10000）：首条 `reqOrder + 1`，之后逐连接 `+1`。
- `next(connId, msgId, reqOrder)` 按上述规则返回下一个 order；`reset(connId)` 在断连时清理。

---

## WsGateway — 自研 RFC6455（零依赖）

职责：
1. TCP 手搓 WS 握手，**必须回显**客户端 `Sec-WebSocket-Protocol`（真实客户端发 `xj`，否则判握手失败永不连接）。
2. 连接后主动下发 `buildConnectionAccepted()`（msg1）。
3. 读客户端帧，处理 `close(0x8)` / `ping(0x9)`（`→pong`）/ `pong(0xa)`；客户端 C2S 是 IFix JIT 内联加密，**不解析**，仅 `FrameRecorder.record('C2S')`，真正应答由 `PlainChannel` 驱动。
4. `sendS2C(frame)` 把 S2C 帧下发到「活跃连接」（无活动连接则告警丢弃）。
5. 客户端帧带 mask（RFC6455 要求），需反掩；server→client 帧 `FIN=1`、**不加 mask**。

对外 API：
```ts
class WsGateway extends Server {
  getActiveConnId(): string;            // 供 PlainChannel 取当前连接
  sendS2C(frame: S2CFrame): void;       // 经活跃连接下发 S2C
}
```

---

## PlainChannel — Frida 明文侧信道（UDP）

运行时链路（参考 HANDOFF §6.5）：
```
客户端 WebSocketClient.Send(明文帧)
  └─Frida hook→ UDP 127.0.0.1:9002 → 本通道
       parsePlain → deps.onMessage(connId,msgId,order,body) 路由
         → deps.sendS2C(frame) 经 WsGateway 活跃连接下发
```
这正是绕过 C2S 加密（静态不可还原）的关键。

构造依赖注入：
```ts
interface PlainChannelDeps {
  getActiveConnId: () => string;
  sendS2C: (frame: S2CFrame) => void;
  onMessage: (connId, msgId, order, body) => S2CFrame[];
}
```

---

## 设计要点

- **零运行时依赖**：WS 协议、帧解析全手搓，最大化 Docker 健壮性。
- **C2S 加密绕过**：真实 C2S 不解析，明文驱动靠 UDP 侧信道 + Frida relay（relay 在宿主机 Windows 跑，不进容器）。
- **帧记录镜像**：`FrameRecorder` 输出 `logs/gw_YYYYMMDD.jsonl`（含 ts/conn/dir/len/hex/ascii），用于离线比对客户端日志。
