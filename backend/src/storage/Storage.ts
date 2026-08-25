/**
 * Storage.ts — 存储抽象层。
 *
 * 游戏主打 1v1 pvp/pve，业务涉及好友 / 活动 / 卡组等，redis 与数据库「可能」有用。
 * 这里只定义统一接口并提供一个开箱即用的内存实现；Redis / Database 作为懒加载桩，
 * 配置 STORAGE_DRIVER=redis|database 时再接入（本阶段不实现具体协议，避免引入运行时依赖）。
 *
 * 设计：面向未来扩展，业务代码只依赖 Storage 接口，不关心后端。
 */
import { Logger } from '../core/Logger';

/** 统一的键值存储接口（字符串值；复杂结构由调用方自行 JSON 序列化）。 */
export interface Storage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  del(key: string): Promise<void>;
  /** 可选：列出某前缀下的 key（内存实现支持，桩可抛 NotImplemented）。 */
  keys?(prefix: string): Promise<string[]>;
}

/** 进程内内存存储（默认）。单容器本地服务足够覆盖 pvp/pve 单机模拟。 */
export class MemoryStorage implements Storage {
  private map = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.map.has(key) ? (this.map.get(key) as string) : null;
  }
  async set(key: string, value: string): Promise<void> {
    this.map.set(key, value);
  }
  async del(key: string): Promise<void> {
    this.map.delete(key);
  }
  async keys(prefix: string): Promise<string[]> {
    return [...this.map.keys()].filter((k) => k.startsWith(prefix));
  }
}

/**
 * 懒加载桩：Redis / Database 在未接入时抛出可读错误，提示切换到 memory 或实现驱动。
 * 预留扩展点，不引入 ioredis / 数据库驱动等运行时依赖。
 */
export class PlaceholderStorage implements Storage {
  constructor(private driver: string, private logger: Logger) {}

  private notImpl(): never {
    this.logger.error(
      'storage',
      `STORAGE_DRIVER=${this.driver} 尚未实现；请改为 memory，或在此处接入对应驱动（预留扩展点）。`,
    );
    throw new Error(`Storage driver "${this.driver}" not implemented`);
  }
  async get(): Promise<string | null> {
    return this.notImpl();
  }
  async set(): Promise<void> {
    this.notImpl();
  }
  async del(): Promise<void> {
    this.notImpl();
  }
}

/** 依据配置构造存储实例。 */
export function createStorage(config: { storageDriver: string }, logger: Logger): Storage {
  switch (config.storageDriver) {
    case 'memory':
      return new MemoryStorage();
    case 'redis':
    case 'database':
      return new PlaceholderStorage(config.storageDriver, logger);
    default:
      logger.warn('storage', `未知 STORAGE_DRIVER=${config.storageDriver}，回退到 memory`);
      return new MemoryStorage();
  }
}
