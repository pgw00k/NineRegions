/**
 * HttpContext.ts — 单个 HTTP 请求的上下文封装。
 *
 * 统一给路由 handler 提供：
 *  - 请求侧：method / url / pathname / 动态段 params / readBody() / readForm()
 *  - 响应侧：json() / text() / send()，统一 Content-Type 与日志挂钩
 *
 * handler 不应直接触碰 http.IncomingMessage / http.ServerResponse，
 * 便于将来统一注入中间件（鉴权、限流等）而不改动各路由实现。
 */
import * as http from 'http';
import { URL } from 'url';
import { Buffer } from 'buffer';
import * as fs from 'fs';
import type { Logger } from '../core/Logger';

export class HttpContext {
  readonly req: http.IncomingMessage;
  readonly res: http.ServerResponse;
  readonly method: string;
  readonly url: URL;
  readonly pathname: string;
  /** 路由匹配到的动态段参数（由 HttpRouter 填充） */
  params: Record<string, string> = {};

  private readonly logger: Logger;
  private bodyCache?: Promise<Buffer>;
  private responded = false;

  constructor(req: http.IncomingMessage, res: http.ServerResponse, logger: Logger) {
    this.req = req;
    this.res = res;
    this.method = (req.method || 'GET').toUpperCase();
    this.url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    this.pathname = this.url.pathname;
    this.logger = logger;

    console.log('req', req.url);
  }

  /** 完整读取请求体（幂等：重复调用返回同一份缓存）。 */
  readBody(): Promise<Buffer> {
    if (!this.bodyCache) {
      this.bodyCache = new Promise<Buffer>((resolve) => {
        const chunks: Buffer[] = [];
        let size = 0;
        this.req.on('data', (c: Buffer) => {
          chunks.push(c);
          size += c.length;
        });
        this.req.on('end', () => resolve(Buffer.concat(chunks, size)));
        this.req.on('error', () => resolve(Buffer.alloc(0)));
      });
    }
    return this.bodyCache;
  }

  /** 解析 application/x-www-form-urlencoded 请求体；非该格式也尽量按 &/= 解析。 */
  async readForm(): Promise<Record<string, string>> {
    const buf = await this.readBody();
    const text = buf.toString('utf-8');
    const out: Record<string, string> = {};
    for (const pair of text.split('&')) {
      if (!pair) continue;
      const eq = pair.indexOf('=');
      const key = eq >= 0 ? pair.slice(0, eq) : pair;
      const val = eq >= 0 ? pair.slice(eq + 1) : '';
      try {
        out[decodeURIComponent(key)] = decodeURIComponent(val);
      } catch {
        out[key] = val; // 个别非法转义不阻塞解析
      }
    }
    return out;
  }

  /** 写 JSON 响应。 */
  json(data: unknown, status = 200): void {
    this.send(status, JSON.stringify(data), 'application/json; charset=utf-8');
  }

  /** 写已序列化的 JSON 字符串（避免双重序列化，如直接下发 patchlist 文件内容）。 */
  jsonRaw(body: string, status = 200): void {
    this.send(status, body, 'application/json; charset=utf-8');
  }

  /** 写纯文本响应。 */
  text(body: string, status = 200): void {
    this.send(status, body, 'text/plain; charset=utf-8');
  }

  /**
   * 静态文件响应（支持 Range 续传）。
   *  - 无 Range：200 + 全文；
   *  - Range: bytes=start-end：206 + Content-Range + 分片（客户端 patchlist 用 Range 续传，
   *    capture_server.py 实证）；格式非法回 416。
   *  - 文件不存在回 404（由调用方在 sendFile 前判断或捕获）。
   */
  sendFile(absPath: string, contentType: string): void {
    if (this.responded) return;
    const data = readFileOrNull(absPath);
    if (data === null) {
      this.responded = true;
      this.res.writeHead(404, { 'Content-Length': '0' });
      this.res.end();
      this.logger.info('http', `${this.method} ${this.pathname} 404 0B (file miss: ${absPath})`);
      return;
    }

    const rng = this.req.headers.range;
    const m = rng ? /^bytes=(\d*)-(\d*)$/.exec(rng.trim()) : null;
    if (rng && !m) {
      this.responded = true;
      this.res.writeHead(416, { 'Content-Range': `bytes */${data.length}` });
      this.res.end();
      this.logger.info('http', `${this.method} ${this.pathname} 416 (bad range: ${rng})`);
      return;
    }
    if (m) {
      const start = m[1] !== '' ? Number(m[1]) : 0;
      const endIn = m[2] !== '' ? Math.min(Number(m[2]), data.length - 1) : data.length - 1;
      if (start > endIn || start >= data.length) {
        this.responded = true;
        this.res.writeHead(416, { 'Content-Range': `bytes */${data.length}` });
        this.res.end();
        this.logger.info('http', `${this.method} ${this.pathname} 416 (range out of bounds)`);
        return;
      }
      const chunk = data.subarray(start, endIn + 1);
      this.responded = true;
      this.res.writeHead(206, {
        'Content-Type': contentType,
        'Content-Length': String(chunk.length),
        'Content-Range': `bytes ${start}-${endIn}/${data.length}`,
        'Accept-Ranges': 'bytes',
      });
      this.res.end(chunk);
      this.logger.info('http', `${this.method} ${this.pathname} 206 ${chunk.length}B (${start}-${endIn}/${data.length})`);
      return;
    }

    this.responded = true;
    this.res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': String(data.length),
      'Accept-Ranges': 'bytes',
    });
    this.res.end(data);
    this.logger.info('http', `${this.method} ${this.pathname} 200 ${data.length}B (file)`);
  }

  /** 统一写响应：记录访问日志、防重复写。 */
  send(status: number, body: string, contentType: string): void {
    if (this.responded) return;
    this.responded = true;
    const payload = Buffer.from(body, 'utf-8');
    this.res.writeHead(status, {
      'Content-Type': contentType,
      'Content-Length': String(payload.length),
    });
    this.res.end(payload);
    this.logger.info('http', `${this.method} ${this.pathname} ${status} ${payload.length}B`);
  }

  /** 打点类接口（如 /r/:ver/statistics）的专用日志：只记录关键字段，不阻塞响应。 */
  logStatistics(form: Record<string, string>): void {
    const step = form['loginstep'] ?? '?';
    const user = form['userid'] ?? form['userId'] ?? form['uid'] ?? '?';
    this.logger.info('http', `statistics: loginstep=${step} userid=${user}`);
  }

  /** 路由 handler 抛错时的统一兜底（HttpRouter 捕获后调用）。 */
  onHandlerError(pattern: string, err: unknown): void {
    if (this.responded) return;
    this.responded = true;
    const msg = err instanceof Error ? err.message : String(err);
    this.logger.error('http', `handler error ${this.method} ${this.pathname} [${pattern}]: ${msg}`);
    this.res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    this.res.end('internal error');
  }
}

/** 读文件，不存在/读失败返回 null。 */
function readFileOrNull(absPath: string): Buffer | null {
  try {
    return fs.readFileSync(absPath);
  } catch {
    return null;
  }
}
