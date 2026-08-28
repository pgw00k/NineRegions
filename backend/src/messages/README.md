# messages — 消息路由与应答

本目录是后端「应答逻辑」的核心：把一条收到的 C2S（已解密，msgId / order / body）路由到对应的
**应答器**（`Handlers`），调用其 `Handle` 得到返回对象，再编码为 protobuf、包装成 S2C 帧下发。

---

## 当前架构（MessageRouter2 + MessageController / AutoResponser）

> 起作用的只有两处：`MessageRouter2.ts`（路由编排）与 `../net/msg/`（自动生成的应答器）。
> `types.ts` 仅定义链路内最小类型 `S2CFrame`。旧的 `MessageRegistry / MockLoader /
> ProtoTools / handlers/* / OrderTracker` 已删除，不要再依赖它们。

```
C2S（已解密, msgId/order/body）
  → MessageRouter2.route()
      ① 按 msgId 取静态 schema（mc-local-share 的 get）→ 剥离 NetBitStream 信封 → decodeMessage 为「字段名对象」
      ② 取 AutoResponser[msgId]（MessageController 自动注册）→ responder.Handle(req) 得「字段名返回对象」
      ③ 按 responder.recId 取静态 schema → encodeMessage → wrapDynProtoAuto 包 dynproto
      ④ 产出 1 条 S2CFrame{ msgId: recId, order: 原样沿用, body: dynproto 体 }
  → WsGateway.sendS2C → buildS2C（10B 头）下发
```

三条设计约束（写入本文件的意图，勿破坏）：
- 全程只依赖共享层静态编解码/注册表（`mc-local-share`），本文件不碰「操作号之外的业务细节」；
- **不做任何附加业务**：无内部消息特判、无 order 增/减；每条 C2S 至多产出一条 S2C；
- 解码 / 编码 / 处理任一环节失败即**静默丢弃**该请求（不打 `INTERNAL` / `OrderTracker` 那些旧逻辑）。

---

## 文件清单

| 文件 | 职责 |
|---|---|
| `MessageRouter2.ts` | 路由核心：schema 编解码 + 查 `MessageController.AutoResponser` + 包装 dynproto。含 `stripNetBitStream`（C2S 业务体前信封剥离） |
| `types.ts` | 链路最小类型：`S2CFrame { msgId, order, body }` |

应答器实际在 [`../net/msg/`](../net/msg/)：
- `MessageController.ts`（**自动生成**）：`AutoResponser[reqId] = new 某应答器()`；
- `NetMsg_*.ts`（**自动生成**）：每个都是 `IHandle<REQ, REP>`，带 `readonly reqId / recId` 与 `Handle(req)`；
- `../net/msg_mod/MessageControllerMod.ts`：可复写/追加的应答器扩展点（如心跳、逻辑重连）；
- `../net/IHandle.ts`：`IHandle<REQ, REP>` 契约（`Handle(req): REP`）；
- `../net/MessageControllerBase.ts`：`AutoResponser` 容器基类。

> 这些文件由 `mc-local-share` 的 `generate_ts` / `generate_res` 自动生成，**请勿手改**；
> 生成后如需新增消息，参照 `Handler` 结构写到一个 `msg/` 或 `msg_mod/` 文件并注册即可。

---

## 新增 / 修改一个业务应答

1. 在 `proto` / `share` 层确认 REQ/REP 消息 schema 已生成（`MESSAGE_ID` 枚举、`XxxRequest/XxxResponse` 类型）。
2. 新建一个 `IHandle<REQ, REP>` 应答器（参照 [`../net/msg/NetMsg_EnterGame.ts`](../net/msg/NetMsg_EnterGame.ts)）：
   - 声明 `readonly reqId` 与 `readonly recId`（来自 `MESSAGE_ID`）；
   - `Handle(req): REP` 直接返回**字段名**对象（如 `{ error: 0, index: "测试文本", ... }`）；
   - 若为自动生成文件则由生成脚本产出，修改生成源后重新生成。
3. 在 `MessageController`（或 `MessageControllerMod`）注册：`AutoResponser[reqId] = new NetMsg_Xxx()`。

```ts
import { IHandle } from '../net/IHandle';
import { MESSAGE_ID, EnterGameRequest, EnterGameResponse } from 'mc-local-share';

export class NetMsg_EnterGame implements IHandle<EnterGameRequest, EnterGameResponse> {
  readonly reqId: MESSAGE_ID = MESSAGE_ID.ENTER_GAME_REQ; // 10001
  readonly recId: MESSAGE_ID = MESSAGE_ID.ENTER_GAME_REP; // 10002
  Handle(req: EnterGameRequest): EnterGameResponse {
    return { error: 0, index: '测试文本', /* ... */ };
  }
}
```

---

## 关键实现点

### ① 请求解码（字段名对象）
按输入 `msgId` 取静态 schema，`decodeMessage(schema, body)` 得到字段名对象。body 需先把
C2S 的 NetBitStream **信封**剥掉（`userId`/`token`/长度段），残余才是纯 protobuf。

### ② 应答编码（字段名 → protobuf）
按 `responder.recId` 取 schema，`encodeMessage(schema, rep)` 直接编码为裸 protobuf。

### ③ dynproto 包裹
裸露 protobuf 不能直接当 S2C body 下发，需包 dynproto 头 `[4B 零][4B LE 长度][pbuf]`
（`wrapDynProtoAuto`，空体/小体补零规则见 [`net/FrameCodec.ts`](../net/FrameCodec.ts)）。

### ④ S2C 帧（bodyLen 含 msgId ★坑）
应答号用 `responder.recId`（**不是** `msgId+1`），order 原样沿用 C2S。最终下发经
`buildS2C(msgId, order, body)`，**其 bodyLen 字段含 msgId 2B**（`body 长度 = bodyLen - 2`）。
若把 bodyLen 写成不算 msgId 的裸长度，客户端会把 body 末尾裁掉 2B、protobuf 截断，
表现为「能解出 MSG ID、解不出 MsgBody」（2026-08-28 实证，已修复）。

---

## 实证一对多映射

- 每个 REQ 的应答号在 `MESSAGE_ID`/`recId` 中显式声明（不依赖旧的 `REQ+1` 猜法）。
- 心跳 `10003` → `10004`、逻辑重连等在 `MessageControllerMod` 中追加注册。