# 仙剑奇侠传九野 (The Nine Regions) — 九野模拟后端

让已停服的 Steam 游戏「仙剑奇侠传九野」在本地完整运行：复刻官方 WS 网关与 HTTP 仿真，
对客户端加密 C2S 直读解密后，用**自动生成 + 手写**的应答器逐个模拟业务消息。

- **语言**：TypeScript + Node（打包成独立 `nine-regions-backend.exe`，运行不依赖 Node）
- **运行时依赖**：仅 `mc-local-share`（共享层的静态 protobuf schema 与编解码）
- **协议源**：schema / MESSAGE_ID / services 由 `share/scripts/*.ts` 从 lua 解析生成，见 [`../share/`](../share/)
- **C2S 解密**：`net/C2SCrypto.ts` 离线恢复帧 key 直读密文，**脱离 Frida 明文侧信道**

> 详细协议事实、帧格式、坑与教训见各目录 `README.md`（重点 `net/` 与 `messages/`）。

---

## 快速开始

```bash
pnpm install          # 安装（monorepo：share + backend）
pnpm --filter mc-local-share build     # 先编译共享层（若 schema 有改动还需 gen）
pnpm --filter mc-local-backend dev     # tsc 编译 + node dist/src/index.js
```

启动后监听：
- `ws://0.0.0.0:8800` — 游戏 WS 网关（握手需回显 `Sec-WebSocket-Protocol: xj`）
- `http://0.0.0.0:4010` — `/login`、`/ver` 等 HTTP 登录仿真

> 直接连真实客户端：把游戏登录域名指向本机（hosts + 本地 CA，见 `capture/certs`），启动服务，
> 客户端即可走通 登录 → 握手 → 进游戏 → 业务消息。

---

## 目录结构

```
backend/
├── src/
│   ├── config/env.ts              # 配置与路径常量
│   ├── core/                      # Logger / Server 基类
│   ├── net/                       # FrameCodec / WsGateway / C2SCrypto / FrameRecorder
│   │   ├── msg/                   # 自动生成的应答器（NetMsg_*.ts）
│   │   ├── msg_mod/               # 应答器扩展点（心跳、逻辑重连）
│   │   ├── IHandle.ts             # IHandle<REQ,REP> 契约
│   │   └── MessageControllerBase.ts
│   ├── messages/                  # MessageRouter2（路由）+ types
│   ├── http/                      # HttpServer（/login /ver 仿真）
│   ├── data/game/                 # 游戏静态数据（cards/decks/heros/heroSkills...）
│   ├── state/                     # 用户/账号状态（可选）
│   └── index.ts                   # 装配入口（gateway + router + http）
├── static/                        # 静态资源（patchlist 等）
├── share/ → ../share               # 共享层（pnpm workspace）
├── tmp_*.js / tmp_*.ts            # 开发期临时脚本（可安全删除）
├── Dockerfile / docker-compose.yml / .env.example / tsconfig.json / package.json
└── README.md
```

---

## 设计要点

- **零运行时 npm 依赖**：WS（RFC6455 手搓）、C2S 解密、protobuf 编解码全部自研/共享层，最大化打包健壮性。
- **应答 = `AutoResponser[reqId].Handle(req)`**：`MessageController`（自动生成）按 `reqId` 注册应答器，
  每个应答器实现 `IHandle<REQ, REP>`，声明 `reqId/recId` 并 `Handle(req)` 返回字段名对象。
- **帧格式**：S2C 为 `[bodyLen u32][order u32][msgId u16][body]`，**bodyLen 含 msgId 2B**（详见 `net/README`）；
  逻辑消息 body 包 dynproto（`[4B零][4B LE 长度][pbuf]`，空体 8B、小体补零 28B）。
- **不回显 order / 不特判内部消息**：`MessageRouter2` 不做 `OrderTracker` 与内部消息分类，
  每条 C2S 至多产出一条 S2C，失败即静默丢弃。
- **C2S 解密直读**：`WsGateway` 收密文 → `decryptC2S` 还原 `{msgId, order, body}` → `MessageRouter2` 应答。

---

## 新增一个业务消息

1. 在 `share` 确认 REQ/REP 的 schema 与 `MESSAGE_ID` 已生成（见 [`../share/README`](../share/) 或生成脚本）。
2. 新建一个应答器（参照 [`src/net/msg/NetMsg_EnterGame.ts`](src/net/msg/NetMsg_EnterGame.ts)）：

```ts
import { IHandle } from '../net/IHandle';
import { MESSAGE_ID, EnterGameRequest, EnterGameResponse } from 'mc-local-share';

export class NetMsg_EnterGame implements IHandle<EnterGameRequest, EnterGameResponse> {
  readonly reqId: MESSAGE_ID = MESSAGE_ID.ENTER_GAME_REQ; // 10001
  readonly recId: MESSAGE_ID = MESSAGE_ID.ENTER_GAME_REP; // 10002
  Handle(req: EnterGameRequest): EnterGameResponse {
    return { error: 0, /* ...字段名对象... */ };
  }
}
```

3. 在 `MessageController`（或 `MessageControllerMod`）注册：`this.AutoResponser[reqId] = new NetMsg_Xxx();`。

> 若为 `share` 自动生成文件，改动后跑生成脚本、重新 `pnpm --filter mc-local-share build` 再编译。

---

## 打包为独立 exe（不经 Node 运行）

```bash
pnpm run pack       # build(tsc) → bundle(esbuild) → pkg → dist/pack/nine-regions-backend.exe
pnpm run pack:dir   # 在 pack 基础上再拷 static、.env.example（见 backend/package.json）
```

---

## 配置（`.env` 或环境变量，见 `.env.example`）

| 变量 | 默认 | 说明 |
|---|---|---|
| `WS_PORT` | 8800 | WS 网关端口 |
| `HTTP_PORT` | 4010 | HTTP 仿真端口 |
| `WS_SUBPROTOCOL` | xj | 必须回显的子协议 |
| `RECORD_FRAMES` | true | 是否记录全量帧到 logs/gw_*.jsonl |
| `GAME_HOST` / `GAME_PORT` / `GAME_VER` | 127.0.0.1 / 8800 / 0.12.786 | 下发给客户端的服务器信息 |

详见各模块目录下的 `README.md`（重点 `net/` 与 `messages/`）。
