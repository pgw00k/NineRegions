# core — 基础设施（日志 + 服务基类）

本目录是所有子系统的公共底座：**统一日志** 与 **服务生命周期基类**，被 `net/`、`http/`、`messages/` 下的组件广泛使用。

---

## 文件清单

| 文件 | 职责 |
|---|---|
| `Logger.ts` | OOP 分级日志。每个子系统持有一个带 `name` 的实例，便于区分来源。 |
| `Server.ts` | 服务器组件抽象基类。所有可独立启动的子系统（WS 网关 / UDP 明文通道 / HTTP 服务）继承它，统一 `start()`/`stop()` 生命周期。 |

---

## Logger

```ts
const logger = new Logger('ws', 'info'); // name 区分来源；级别 debug|info|warn|error
logger.debug('细节', extra);
logger.info('启动完成');
logger.warn('无活跃连接');
logger.error('出错', err);
```

- 级别低于 `minLevel` 时静默；`error`→`console.error`、`warn`→`console.warn`、其余→`console.log`。
- 时间格式与参考网关一致（`toISOString()`，便于对照客户端日志时间线）。
- `extra` 会被 `safeStringify` 序列化，字符串原样输出。

---

## Server（抽象基类）

```ts
abstract class Server {
  abstract start(): Promise<void> | void;
  abstract stop(): void;
  isRunning(): boolean;          // 只读，由 setRunning() 维护
  protected setRunning(v: boolean): void;
}
```

子类约定：
1. `start()` 完成端口监听后调用 `this.setRunning(true)`。
2. `stop()` 先 `setRunning(false)`，再关闭 socket/server。
3. `index.ts` 统一编排所有 `Server` 子类的 `start()`/`stop()`，并在 SIGINT/SIGTERM 时优雅退出。

---

## 设计要点

- **零运行时依赖**：仅用 Node 内置 `console`，不引入任何第三方日志库。
- **依赖注入而非全局单例**：日志实例、配置对象均以构造参数或 `Config` 导入方式传递，便于替换与测试。
