/**
 * HttpServer.ts — HTTP 仿真层（/ver 与 /login），整合进 TS 服务便于单容器 Docker。
 *
 * 实证结论（HANDOFF.md §6.2/§6.3）：
 *  - /ver 所有字段必须是「字符串」（port 给数字会被客户端 NRE）；
 *  - /login 是 JSON 不是 protobuf，客户端 JsonConvert 只吃 JSON；同时返回驼峰与帕斯卡
 *    大小写变体字段，防 NRE。
 * 客户端通过 hosts 把官方域名指向本机，由本地 CA 证书过 TLS；这里只负责 HTTP 语义。
 */
import * as http from 'http';
import { URL } from 'url';
import { Buffer } from 'buffer';
import { Server } from '../core/Server';
import { Logger } from '../core/Logger';
import { Config } from '../config/env';

export class HttpServer extends Server {
  private server?: http.Server;

  constructor(logger: Logger) {
    super('http', logger);
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
    this.logger.info('http', `HTTP 仿真监听 http://${Config.httpHost}:${Config.httpPort} (/ver, /login)`);
  }

  async stop(): Promise<void> {
    this.setRunning(false);
    if (this.server) {
      await new Promise<void>((r) => this.server!.close(() => r()));
    }
  }

  private handle(req: http.IncomingMessage, res: http.ServerResponse): void {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    if (url.pathname === '/ver') return this.sendVer(res);
    if (url.pathname === '/login') return this.handleLogin(req, res);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('not found');
  }

  private sendVer(res: http.ServerResponse): void {
    // 全部字符串，port 必须是字符串（客户端 NRE 实测）
    const body = {
      ver: Config.gameVer,
      cdn: Config.gameCdn,
      cdnbak: '',
      host: Config.gameHost,
      port: String(Config.gamePort),
      phost: '',
      pport: '',
      newapp: '',
      notice: '',
      state: '0',
      tag: '',
      md5: '',
      supportver: '0.12.0',
      forceupdate: '0',
      packresetver: '',
    };
    const json = JSON.stringify(body);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(json);
    this.logAccess('/ver');
  }

  private handleLogin(req: http.IncomingMessage, res: http.ServerResponse): void {
    let buf = '';
    req.on('data', (c: Buffer) => (buf += c.toString('utf-8')));
    req.on('end', () => {
      const token = 'localtoken123';
      // 驼峰 + 帕斯卡大小写变体，防客户端字段名不匹配导致 NRE
      const resp = {
        error: 0,
        index: '0',
        token,
        host: Config.gameHost,
        port: String(Config.gamePort),
        Error: 0,
        Index: '0',
        Token: token,
        Host: Config.gameHost,
        Port: String(Config.gamePort),
        uid: '76561198124119613',
        userid: '76561198124119613',
        session: token,
      };
      const json = JSON.stringify(resp);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(json);
      this.logAccess('/login');
    });
  }

  private logAccess(path: string): void {
    this.logger.info('http', `GET ${path} 200`);
  }
}
