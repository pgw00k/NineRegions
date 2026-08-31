# NineRegions

仙剑奇侠传九野的本地模拟服务器（pnpm monorepo）。

## 子包

- **[`backend/`](backend/)** — 九野模拟后端：「C2S 密文解密 → 路由 → S2C 应答」的 WS 网关 + HTTP 登录仿真。
  可打包为独立 `nine-regions-backend.exe`（不依赖 Node）。详见其 [`README`](backend/README.md)。
- **[`share/`](share/)** — 共享层（`mc-local-share`）：静态 protobuf schema + 编解码器 + 代码生成脚本。
  backend 与 gRPC 侧共用，避免协议漂移。详见其 [`README`](share/README.md)。
- **[`proto/`](proto/proto/)** — 生成的 gRPC 定义（`message.proto` / `services.proto`）。
- **[`capture/`](capture/)** — 抓包/仿真辅助（CA 证书、capture_client、参考网关脚本）。
- **[`tools/`](tools/)** — 协议提取 / frida hook 等开发工具。

## 常用命令

```bash
pnpm install
pnpm --filter mc-local-share build      # 先编译共享层
pnpm --filter mc-local-backend dev      # 编译并启动后端
```

> 详细协议事实、帧格式、S2C bodyLen 坑等见各目录 `README.md`（重点 `backend/src/net`、`backend/src/messages`）。
