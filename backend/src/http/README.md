# http — HTTP 仿真层（/ver 与 /login）

本目录整合进 TS 服务（非独立 Python，便于单容器 Docker），负责客户端登录链路最前端的 HTTP 仿真。

---

## 文件

| 文件 | 职责 |
|---|---|
| `HttpServer.ts` | `http.Server` 子类，处理 `/ver` 与 `/login`（其余 404）。 |

---

## 实证结论（HANDOFF §6.2 / §6.3，已写入代码注释）

1. **`/ver` 所有字段必须是字符串** —— `port` 给数字会被客户端 NRE。
2. **`/login` 是 JSON 不是 protobuf** —— 客户端 `JsonConvert` 只吃 JSON；同时返回**驼峰 + 帕斯卡大小写变体**字段，防客户端字段名不匹配导致 NRE。

---

## 端点

### `GET /ver`
返回全字符串字段（port 经 `String()` 化）：

```json
{
  "ver": "0.12.786", "cdn": "...", "host": "127.0.0.1", "port": "8800",
  "state": "0", "supportver": "0.12.0", "forceupdate": "0", ...
}
```

### `POST /login`
读取请求体（忽略），返回固定本地 token 与服务器地址（驼峰 + 帕斯卡双份）：

```json
{
  "error": 0, "index": "0", "token": "localtoken123", "host": "127.0.0.1", "port": "8800",
  "Error": 0, "Index": "0", "Token": "localtoken123", "Host": "127.0.0.1", "Port": "8800",
  "uid": "76561198124119613", "userid": "76561198124119613", "session": "localtoken123"
}
```

> TLS 不在本层处理：客户端通过 `hosts` 把官方域名指向本机 + 本地 CA 证书过 TLS（参考 HANDOFF §2）；本服务只负责 HTTP 语义。

---

## 设计要点

- 整合进 TS 服务，单容器即可运行；不依赖 `express` 等框架，仅用 Node 内置 `http`。
- 字段取值来自 `Config`（`gameHost`/`gamePort`/`gameVer`/`gameCdn`），可通过环境变量/`.env` 调整。
