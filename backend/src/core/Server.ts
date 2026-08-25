/**
 * Server.ts — 服务器组件抽象基类。
 *
 * 所有可独立启动的子系统（WS 网关 / UDP 明文通道 / HTTP 服务）都继承自它，
 * 统一生命周期：构造 → start() → stop()。便于在 index.ts 里统一编排与优雅退出。
 */
import { Logger } from './Logger';

export abstract class Server {
  protected readonly logger: Logger;
  protected running = false;

  constructor(name: string, logger?: Logger) {
    this.logger = logger ?? new Logger(name);
  }

  abstract start(): Promise<void> | void;
  abstract stop(): void;

  isRunning(): boolean {
    return this.running;
  }

  protected setRunning(v: boolean): void {
    this.running = v;
  }
}
