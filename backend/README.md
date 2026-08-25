# 仙剑奇侠传九野 (The Nine Regions) — 本地服务器模拟后端

让已停服的 Steam 游戏「仙剑奇侠传九野」在本地完整运行：复刻官方 WS 网关与 HTTP 仿真，
从 `MESSAGE_ID.lua` + `pack_msg` 逐个实现业务消息的模拟应答。

- **语言**：TypeScript + Node 22
- **依赖**：**零运行时 npm 依赖**（自研 RFC6455 WebSocket + 自研 protobuf 编解码）
- **部署**：Docker 单容器（见 `Dockerfile` / `docker-compose.yml`）
- **协议源**：自包含于 `protocol/source/`（`MESSAGE_ID.lua` / `pack_msg` / `NetMsg/*.lua`）

> 详细开发记录、协议事实、坑与教训见 [`Note.md`](./Note.md)。

---

## 快速开始

```bash
npm install        # 仅 devDependencies: typescript + @types/node
npm run build      # tsc 编译到 dist/
npm start          # node dist/src/index.js  （或 npm run dev 一步到位）
npm test           # proto 层 + mock 文件一致性自测
```

启动后监听：
- `ws://127.0.0.1:8800` — 游戏 WS 网关（握手需回显 `Sec-WebSocket-Protocol: xj`）
- `udp://127.0.0.1:9002` — Frida 明文侧信道（接收加密前明文帧）
- `http://127.0.0.1:8080` — `/ver`、`/login` 仿真

### 真实联调前置（宿主机 Windows，不进容器）
1. `hosts` 把官方域名（`xianjiantcglogin.51aiwan.com` 等）指向本机 + 本地 CA 证书（参考蓝本 `HANDOFF.md §2`）。
2. 启动本服务。
3. 启动游戏，进程起来后用 Frida relay（参考 `frida_relay.py <PID>` 或 `auto_relay.py`）hook `WebSocketClient.Send` 转发明文帧到 UDP :9002。
4. 客户端即走通 握手 → 登录 → 进游戏 → 心跳 → 业务消息。

---

## 目录结构

```
backend/
├── src/
│   ├── config/env.ts          # 配置与路径常量
│   ├── core/                  # Logger / Server 基类
│   ├── net/                   # FrameCodec / OrderTracker / FrameRecorder / WsGateway / PlainChannel
│   ├── proto/                 # ProtobufCodec / SchemaRegistry / ProtobufEncoder + 生成物
│   ├── messages/              # MessageRegistry / types / MockLoader / handlers / MessageRouter
│   ├── storage/               # Storage 抽象 + Memory + Redis/Database 桩
│   ├── http/                  # HttpServer (/ver, /login)
│   ├── mocks/                 # 以消息号命名的业务消息模拟 JSON
│   └── index.ts               # 入口编排
├── protocol/source/           # 协议源（自包含）：MESSAGE_ID.lua / pack_msg / NetMsg/*.lua
├── tools/                     # extract_registry.py / test_encoder.ts / dump_schema.ts / smoke_ws.js
├── Dockerfile / docker-compose.yml / .env.example / tsconfig.json / package.json
├── Note.md                    # 开发记录（记忆锚点）
└── README.md
```

---

## 设计要点

- **零运行时依赖**：WS（RFC6455 手搓）、protobuf（线格式原语自研）全部自研，最大化 Docker 健壮性。
- **数据驱动 mock**：`src/mocks/<repMsgId>.json` 用字段号做 key、`$type` 标注 protobuf 短名，加载即生效，无需改代码。
- **帧格式**：S2C / UDP 明文均为 `[bodyLen u32][order u32][msgId u16][body]`；逻辑消息 body 包 dynproto（`[4B零][4B LE 长度][pbuf][小体补零28B]`），内部消息(1/2/3/4/7) 空体不包。
- **order**：逻辑消息 REP 严格递增 REQ+1；内部消息回显（客户端 `OnSetOrder` 校验 `order-logicOrder==1`）。
- **C2S 加密绕过**：C2S 是 IFix JIT 内联加密，静态不可还原；用 Frida 明文侧信道（UDP :9002）拿到明文帧驱动应答。

---

## 新增一个消息模拟

在 `src/mocks/` 新建 `<repMsgId>.json`：

```json
{ "$type": "EnterGameResponse", "1": 0, "2": "1", "22": { "1": "@now", "2": 8 } }
```

- `$type`：protobuf 消息短名（必填，用于定位 schema）。
- key：字段号（字符串）；值：嵌套对象 / 数组 / 标量。
- 占位符：`@now`(秒) `@nowMs` `@gameHost` `@gamePort` `@gameVer`。
- 运行 `npm test` 可校验 `$type` 是否解析、编码是否成功。

---

## 配置（`.env` 或环境变量，见 `.env.example`）

| 变量 | 默认 | 说明 |
|---|---|---|
| `WS_PORT` | 8800 | WS 网关端口 |
| `PLAIN_UDP_PORT` | 9002 | Frida 明文侧信道 UDP 端口 |
| `HTTP_PORT` | 8080 | HTTP 仿真端口 |
| `WS_SUBPROTOCOL` | xj | 必须回显的子协议 |
| `STORAGE_DRIVER` | memory | memory / redis / database（后两者为桩） |
| `RECORD_FRAMES` | true | 是否记录全量帧到 logs/gw_*.jsonl |
| `GAME_HOST` / `GAME_PORT` / `GAME_VER` | 127.0.0.1 / 8800 / 0.12.786 | 下发给客户端的服务器信息 |

详见各模块目录下的 `README.md`。
