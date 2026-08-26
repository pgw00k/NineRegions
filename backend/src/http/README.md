# http — HTTP 仿真层

本目录整合进 TS 服务（非独立 Python，便于单容器 Docker），负责客户端登录链路最前端的 HTTP 仿真，
行为与 `local_server/tools/capture` 的 4010 capture server（`responses.json`）对齐。

---

## 文件

| 文件 | 职责 |
|---|---|
| `HttpServer.ts` | `http.Server` 子类（生命周期 + 路由装配）。**新增端点不改此文件**。 |
| `HttpRouter.ts` | 极简路由表：`register()` 绑定方法精确匹配；`use()` 不限制方法、段前缀匹配（express `app.use` 风格，支持 `:param`）。 |
| `HttpContext.ts` | 请求上下文：`readBody()` / `readForm()`、`json()` / `jsonRaw()` / `text()` / `send()` / `sendFile()`（Range 续传）、统一日志与错误兜底。 |
| `routes/index.ts` | **路由登记表**：新增端点在此 register/use 一行。 |
| `routes/VerRoute.ts` | 版本下发（`/ver` 与 `/r` 前缀兜底共用，对齐 resp/ver.json）。 |
| `routes/LoginRoute.ts` | 登录应答（`/login` 与 `/r/:ver/login`）。 |
| `routes/StatisticsRoute.ts` | `/r/:ver/statistics` 打点 → 返回 `static/patchlist0.12.786.json`。 |
| `routes/StaticRoute.ts` | `/res/` 静态目录服务（映射 `static/`，Range 续传，miss 回退 `static/<basename>`）。 |
| `routes/MiscRoute.ts` | 对齐 4010 的小规则：ip / queryBindRole / version.txt / redirector.txt / newfiler.txt。 |

---

## 如何新增端点

1. 在 `routes/` 写独立 handler 文件（签名 `(ctx: HttpContext) => void | Promise<void>`）；
2. 在 `routes/index.ts` 的 `registerRoutes()` 里加一行 —— **默认用 `use()`**（不限制方法，客户端同路径 GET/POST 混打是常态）；确需限定方法才用 `register()`；
3. 在本 README 端点表补一行。

路径支持 `:param` 动态段，匹配值通过 `ctx.params` 读取（例：`/r/1.0.50/statistics` → `ctx.params.ver === '1.0.50'`）。
匹配优先级（对齐 4010「键长降序」）：段数多 > 动态段少 > 段位精确。

---

## 端点（与 4010 responses.json 对齐）

### 版本下发 — `GET /ver`、`/r` 前缀兜底（ver/lver/device 等都落这里）
**实证：所有字段必须是字符串，port 给数字会被客户端 NRE**（HANDOFF §6.2）；`cdn`/`cdnbak` 指向 `/res/`：

```json
{
  "ver": "0.12.786", "cdn": "http://127.0.0.1:4010/res/", "cdnbak": "http://127.0.0.1:4010/res/",
  "host": "127.0.0.1", "port": "8800", "state": "0", "supportver": "0.12.0", ...
}
```

### 登录 — `POST /login`、`POST /r/:ver/login`
**实证：JSON 非 protobuf；驼峰 + 帕斯卡双份防字段名不匹配 NRE**（HANDOFF §6.3）：

```json
{
  "error": 0, "index": "0", "token": "localtoken123", "host": "127.0.0.1", "port": "8800",
  "Error": 0, "Index": "0", "Token": "localtoken123", "Host": "127.0.0.1", "Port": "8800",
  "uid": "76561198124119613", "userid": "76561198124119613", "session": "localtoken123"
}
```

### 打点 — `GET|POST /r/:ver/statistics`
**实证**（capture_log.jsonl / url_trace_20260825b.log）：`GamePatcher.UnityWebPost` 登录各阶段上报，
GET/POST 都会打，body 形如 `userid=<hash>&loginstep=200013`；**客户端 fire-and-forget 不检查响应**。
**返回内容（用户 2026-08-26 要求）**：`static/patchlist0.12.786.json` 文件全文（懒加载 + 常驻缓存），
`Content-Type: application/json`。打点关键字段记日志：`statistics: loginstep=200013 userid=...`。

### 静态资源 — `/res/<rel>` → `static/<rel>`
对齐 4010 `static_root + strip_prefix` 语义；`<rel>` 未命中时回退 `static/<basename>`
（兼容 patchlist 放根目录的本地布局）。**支持 Range 续传**（206/Content-Range，客户端 patchlist 分片下载，
capture_server.py 实证）；路径穿越（`..`）已防护。

### 其余小规则（responses.json 对齐）
| 路径 | 返回 |
|---|---|
| `/r/:ver/ip` | `{"country_short":"CN","city":"Local"}` |
| `/r/:ver/queryBindRole` | `{"roles":"[]"}` |
| `/version.txt`、`/version_s.txt` | `0.12.786` |
| `/redirector.txt` | `http://127.0.0.1:4010/res/` |
| `/newfiler.txt`、`/newfiler_s.txt` | 空文本 |

---

## 设计要点

- 整合进 TS 服务，单容器即可运行；不依赖 `express` 等框架，仅用 Node 内置 `http`。
- 端点实现与服务器骨架解耦：路由表集中登记、handler 独立成文件，扩展只加文件 + 一行注册。
- 字段取值来自 `Config`（`gameHost`/`gamePort`/`gameVer`/`gameCdn`），可通过环境变量/`.env` 调整。
- TLS 不在本层处理：客户端通过 `hosts` 把官方域名指向本机 + 本地 CA 证书过 TLS（参考 HANDOFF §2）。
