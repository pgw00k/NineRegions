# config — 配置中心

本目录是全局配置的唯一来源，所有网络端口、协议源路径、下发给客户端的服务器信息、存储后端、日志参数都集中在此。

---

## 文件

| 文件 | 职责 |
|---|---|
| `env.ts` | 极简 `.env` 解析（不依赖 dotenv）+ 全局 `Config` 对象 + 以 `backend` 根为基准的绝对路径常量。 |

---

## 设计要点

- **零依赖**：自带 `.env` 行解析（`KEY=VALUE`，支持单/双引号包裹），无需引入 `dotenv`。
- **优先级**：`process.env` 覆盖 `.env` 覆盖默认值（`get()` 实现）。
- **路径以 `backend` 为根**：`dist/src`（编译后）与 `src`（直接 `ts-node`/`tsx`）两种运行方式路径一致，因为 `PROJECT_ROOT = path.resolve(process.cwd())` 始终指向 `backend`。

---

## 关键导出

```ts
export const Config = { /* 见下方配置表 */ };
export const PROJECT_ROOT = path.resolve(process.cwd());
export const PROTOCOL_DIR_ABS: string;     // 协议源绝对路径
export const REGISTRY_PATH_ABS: string;    // 生成物 message-registry.json
export const PACK_MSG_PATH_ABS: string;    // pack_msg（FileDescriptorSet）
export const MOCKS_DIR_ABS: string;        // src/mocks
export const LOG_DIR_ABS: string;          // 帧记录输出目录
```

---

## 配置项（环境变量 / `.env`，均有默认值）

| 变量 | 默认 | 说明 |
|---|---|---|
| `WS_PORT` / `WS_HOST` | 8800 / 0.0.0.0 | WS 网关监听 |
| `WS_SUBPROTOCOL` | xj | 必须回显的子协议（不回显客户端判握手失败）|
| `PLAIN_UDP_PORT` / `PLAIN_UDP_HOST` | 9002 / 0.0.0.0 | Frida 明文侧信道 UDP |
| `HTTP_PORT` / `HTTP_HOST` | 8080 / 127.0.0.1 | HTTP 仿真（/ver /login）|
| `PROTOCOL_DIR` | protocol/source | 协议源相对路径 |
| `REGISTRY_PATH` | src/proto/generated/message-registry.json | 消息注册表 |
| `PACK_MSG_PATH` | protocol/source/pack_msg | protobuf 描述集 |
| `MOCKS_DIR` | src/mocks | mock 文件目录 |
| `GAME_HOST` / `GAME_PORT` / `GAME_VER` / `GAME_CDN` | 127.0.0.1 / 8800 / 0.12.786 / …/res/ | 下发给客户端的服务器信息（/ver 与 /login 用）|
| `STORAGE_DRIVER` | memory | memory / redis / database（后两者为桩）|
| `REDIS_URL` / `DATABASE_URL` | … | 预留存储后端地址 |
| `LOG_LEVEL` | info | debug|info|warn|error |
| `LOG_DIR` | logs | 帧记录输出目录 |
| `RECORD_FRAMES` | true | 是否记录全量帧到 `logs/gw_*.jsonl` |

> 注意：`GAME_PORT` 在 `/ver` 中会被 `String()` 化为字符串（客户端 NRE 实测要求），但在 `Config` 里它是数字，由 `HttpServer` 在回包时转换。
