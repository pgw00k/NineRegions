# messages — 消息路由与应答

本目录是后端「应答逻辑」的核心：把一条收到的 C2S（msgId/order/body）路由到对应的处理器，
产出要下发的 S2C 帧；并提供**数据驱动**的业务消息模拟（`MockLoader` + `src/mocks/*.json`）。

---

## 文件清单

| 文件 | 职责 |
|---|---|
| `types.ts` | 公共类型：`S2CFrame` / `HandlerServices` / `HandlerContext` / `MessageHandler`(抽象基类) / `INTERNAL_MSG_IDS` / `buildResponseFrame` |
| `MessageRegistry.ts` | 加载 `generated/message-registry.json`，提供 `get(msgId)` 与 `responseId(msgId)` |
| `MockLoader.ts` | 加载 `mocks/<repMsgId>.json`，解析 `$type`、替换占位符、按 schema 编码为裸 protobuf |
| `ProtoTools.ts` | C2S 请求解码：剥离 NetBitStream 前缀（`1100`+userID+token 实证）→ 按 schema 递归解码为字段号 keyed 对象 |
| `MessageRouter.ts` | 计算 repMsgId → 构造 `HandlerContext` → 处理器链路由 |
| `handlers/InternalHandler.ts` | 处理内部消息 1/2/3/4/7（回显同号空体）|
| `handlers/GameDataHandler.ts` | **10001 EnterGame → 10002 动态组装**：读 10002.json 骨架，用 `AccountDataStore` 覆写 cardLibrary/deckLibrary/heroLibrary/shopInfo |
| `handlers/DeckHandler.ts` | 牌组/卡牌：10005 EditDeck / 10007 DeleteDeck / 10039 ChangeDeckName / 10041 CardResolve / 10043 CardCompound |
| `handlers/HeroHandler.ts` | 英雄：10260 ChallengeHero / 10262 HeroGiveGift / 10264 GetFavorReward / 10266 SetHeroSkin |
| `handlers/ShopHandler.ts` | 商店：10210 GetShopInfo / 10212 ShopBuy |
| `handlers/MockHandler.ts` | 数据驱动业务消息（命中 `mocks/<repMsgId>.json` 即应答）|
| `handlers/EchoHandler.ts` | 兜底：把收到的 C2S 裸体包 dynproto 回送（永远 match）|

---

## 处理器链（OOP 继承/多态）

`MessageRouter` 按序尝试，首个 `match` 的处理器负责 `handle`：

1. **InternalHandler** — match 内部消息 → 回显同号空体。
2. **ReconnectHandler / BattleHandler / NameHandler** — 重连恢复、战斗链路、起名（见各自文档）。
3. **GameDataHandler / DeckHandler / HeroHandler / ShopHandler** — 业务数据（`AccountDataStore` 档案驱动，状态保持）。
4. **MockHandler** — match `loader.exists(repMsgId)` → 加载 JSON 编码应答；编码失败降级为不回应。
5. **EchoHandler** — 永远 match 兜底；把 C2S 裸体包 dynproto 回送（客户端容错忽略未预期的 REP）。

新增业务消息：**简单应答**丢 `src/mocks/<repMsgId>.json` 即可；**有状态业务**（牌组/英雄/商店）
参照 `DeckHandler`：在 `AccountDataStore` 加 API → 在 `handlers/` 加处理器 → 在 `MessageRouter`
按序注册。请求解析用 `ProtoTools.decodeMessage`（自动剥 NetBitStream 前缀），响应用
`encoder.encode(schema, payload)` + `buildResponseFrame`。

实证：本游戏**所有 REQ/REP 配对均为 `REP = REQ + 1`**。

---

## 应答号（repMsgId）规则

```ts
repMsgId = INTERNAL_MSG_IDS.has(msgId) ? msgId
         : registry.responseId(msgId) ?? msgId + 1;
```

- 内部消息（1/2/3/4/7）：repMsgId = 自身（回显）。
- 其余：优先用注册表 `responseId`（来自 `NetMetaDefine` 的 `recId`）；native 消息（10011/10012、206/207）无 lua 条目，靠 `+1` 兜底（对应 mock 已就绪）。

---

## buildResponseFrame — 统一应答构造

```ts
function buildResponseFrame(ctx: HandlerContext, innerPbuf: Buffer): S2CFrame;
```

- **order**：交给 `OrderTracker`（内部消息回显、逻辑消息逐连接 +1）。
- **dynproto 包裹**：内部消息（repMsgId ∈ {1,2,3,4,7}）**不包 dynproto**，body 即 inner；其余逻辑消息用 `wrapDynProtoAuto` 包裹（小体补零到 28B，大体不补）。

---

## MockLoader

```ts
loader.exists(repMsgId): boolean;
loader.load(repMsgId): Buffer;   // 返回裸 protobuf（不包 dynproto）
```

- mock JSON 约定：
  ```json
  { "$type": "EnterGameResponse", "1": 0, "2": "1", "22": { "1": "@now", "2": 8 } }
  ```
  - `$type`：必填，protobuf 消息**短名**，用于定位 schema。
  - key：字段号（字符串）；值：嵌套对象 / 数组 / 标量。
  - 占位符：`@now`(秒) `@nowMs` `@gameHost` `@gamePort` `@gameVer`（递归替换字符串值）。
- 加载即生效；`npm test` 的 mock 校验段会报告缺失 `$type` 或不可解析类型。

---

## HandlerServices（依赖注入）

```ts
interface HandlerServices {
  schema: SchemaRegistry;
  encoder: ProtobufEncoder;
  orders: OrderTracker;
  registry: MessageRegistry;
  storage: Storage;
  logger: Logger;
  config: typeof Config;
}
```
通过 `index.ts` 注入，避免全局单例，便于替换/测试。
