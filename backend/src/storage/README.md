# storage — 存储抽象层

本目录定义统一的键值存储接口，并提供一个开箱即用的内存实现；Redis / Database 作为**懒加载桩**预留。

---

## 文件

| 文件 | 职责 |
|---|---|
| `Storage.ts` | `Storage` 接口 + `MemoryStorage`（默认）+ `PlaceholderStorage`（redis/database 桩）+ `createStorage` 工厂 |

---

## 设计动机

游戏主打 1v1 pvp/pve，业务涉及好友 / 活动 / 卡组等，**Redis 与数据库「可能」有用**。
但本阶段为保持**零运行时依赖**、单容器本地服务，只实现内存版；Redis / Database 预留扩展点。

---

## 接口与实现

```ts
interface Storage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  del(key: string): Promise<void>;
  keys?(prefix: string): Promise<string[]>;  // 可选
}
```

- **`MemoryStorage`**（默认）：进程内 `Map`，单机本地模拟足够覆盖 pvp/pve。
- **`PlaceholderStorage`**：配置 `STORAGE_DRIVER=redis|database` 时启用，未接入具体协议，调用即抛可读错误并提示切回 `memory` 或在此接入驱动（不引入 `ioredis`/数据库驱动等运行时依赖）。
- **`createStorage(config, logger)`**：依据 `storageDriver` 分发实例；未知值告警并回退 `memory`。

---

## 用法

业务代码只依赖 `Storage` 接口，不关心后端：

```ts
const storage = createStorage({ storageDriver: Config.storageDriver }, logger);
await storage.set('uid:123:deck', JSON.stringify(deck)); // 复杂结构由调用方 JSON 序列化
const v = await storage.get('uid:123:deck');
```

后续若需好友/活动持久化，在此实现 `RedisStorage` / `DatabaseStorage`（实现 `Storage` 接口）即可，业务层零改动。
