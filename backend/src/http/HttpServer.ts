/**
 * HttpServer.ts — HTTP 仿真层入口（路由装配 + 生命周期）。
 *
 * 职责收敛为两件事：
 *  1. 生命周期：作为 Server 子类提供 start()/stop()（index.ts 统一编排不变）；
 *  2. 装配：把请求交给 HttpRouter 分发，未命中兜底 404。
 *
 * 端点实现全部下沉到 routes/ 目录（见 routes/index.ts 登记表），新增路由
 * 无需改动本文件。路由层实证结论（/ver 全字符串、/login 双大小写变体、
 * /r/:ver/statistics 打点）见各 handler 文件注释。
 *
 * 客户端通过 hosts 把官方域名指向本机，由本地 CA 证书过 TLS；这里只负责 HTTP 语义。
 */
import * as http from 'http';
import { Server } from '../core/Server';
import { Logger } from '../core/Logger';
import { Config } from '../config/env';
import { HttpRouter } from './HttpRouter';
import { HttpContext } from './HttpContext';
import { registerRoutes } from './routes';

export class HttpServer extends Server {
  private server?: http.Server;
  private readonly router = new HttpRouter();

  constructor(logger: Logger) {
    super('http', logger);
    registerRoutes(this.router);
  }

  async start(): Promise<void> {
    this.server = http.createServer((req, res) => this.handle(req, res));
    this.server.on('error', (e) => this.logger.error('http', `server error: ${(e as Error).message}`));
    await new Promise<void>((resolve, reject) => {
      this.server!.once('error', reject);
      this.server!.listen(Config.httpPort, Config.httpHost, () => {
        this.server!.removeListener('error', reject);
        resolve();
      });
    });
    this.setRunning(true);
    this.logger.info(
      'http',
      `HTTP 仿真监听 http://${Config.httpHost}:${Config.httpPort} (${this.router.list().join(', ')})`,
    );
  }

  async stop(): Promise<void> {
    this.setRunning(false);
    if (this.server) {
      await new Promise<void>((r) => this.server!.close(() => r()));
    }
  }

  private handle(req: http.IncomingMessage, res: http.ServerResponse): void {
    const ctx = new HttpContext(req, res, this.logger);
    if (!this.router.dispatch(ctx.method, ctx.pathname, ctx)) {
      ctx.text('not found', 404);
    }
  }
}
