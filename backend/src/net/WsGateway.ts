/**
 * WsGateway.ts — 自研 RFC6455 WebSocket 网关（零依赖）。
 *
 * 职责（复刻参考 gateway.py 的 WS 部分）：
 *  1) TCP 层手搓 WebSocket 握手，必须回显客户端请求的 Sec-WebSocket-Protocol（真实客户端发 "xj"），
 *     否则客户端判定握手失败、永不连接；
 *  2) 连接建立后主动下发 CONNECTION_REQUEST_ACCEPTED（msgId=1, order=0, opcode=0x2）；
 *  3) 读取客户端帧，处理 close/ping/pong；客户端 C2S 是 IFix JIT 内联加密，本服务不解析，
 *     仅记录（FrameRecorder），真正应答由 UDP 明文侧信道（PlainChannel）驱动；
 *  4) 暴露 sendS2C(frame) 把 S2C 应答帧下发到「活跃连接」。
 *
 * 帧格式（实证）：
 *  - S2C = [bodyLen u32 LE][order u32 LE][msgId u16 LE][body]（buildS2C 构造），再包 RFC6455 二进制帧；
 *  - 客户端帧可能带 mask（RFC6455 要求客户端必须 mask），需反掩。
 */
import * as net from 'net';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Buffer } from 'buffer';
import { Server } from '../core/Server';
import { Logger } from '../core/Logger';
import { Config } from '../config/env';
import { buildS2C, buildConnectionAccepted } from './FrameCodec';
import { FrameRecorder } from './FrameRecorder';
import { S2CFrame } from '../messages/types';
import { decryptC2S, DecodedC2S } from './C2SCrypto';

const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

export class WsGateway extends Server {
  private server?: net.Server;
  /** connId → socket（多客户端：每条连接各自独立，互不影响）。 */
  private readonly sockets = new Map<string, net.Socket>();
  private connCounter = 0;
  private recorder: FrameRecorder;
  /** 本进程是否曾有过成功连接（仅用于日志标记「重连会话」）。 */
  private hadPriorSession = false;
  private readonly markerPath = path.join(os.tmpdir(), 'nineregions.reconnect');
  /** 连接建立回调（由 index.ts 注入，创建 Client 并登记入 ConnManager）。 */
  private onConnCreate?: (connId: string) => void;
  /** 连接断开回调（由 index.ts 注入，清理 Client / PVE 结算状态等）。 */
  private onConnClose?: (connId: string) => void;
  /** C2S 解密后回调（由 index.ts 注入，路由应答）。返回要下发的 S2C 帧。 */
  private onC2S?: (connId: string, frame: DecodedC2S) => S2CFrame[];

  constructor(logger: Logger) {
    super('ws', logger);
    this.recorder = new FrameRecorder(logger, Config.recordFrames);
    try {
      this.hadPriorSession = fs.existsSync(this.markerPath);
    } catch {
      this.hadPriorSession = false;
    }
  }

  /** 注册连接建立回调（创建 Client 登记入 ConnManager）。 */
  setOnConnCreate(cb: (connId: string) => void): void {
    this.onConnCreate = cb;
  }

  /** 注册连接断开回调（清理 PVE 结算状态等）。 */
  setOnConnClose(cb: (connId: string) => void): void {
    this.onConnClose = cb;
  }

  /** 注册 C2S 解密回调（脱离 Frida：直接解析 WS 线上密文并应答）。 */
  setOnC2S(cb: (connId: string, frame: DecodedC2S) => S2CFrame[]): void {
    this.onC2S = cb;
  }

  /** 握手成功后标记「本进程已有过连接」，使后续连接（含跨重启）被识别为重连会话。 */
  private markPriorSession(): void {
    if (this.hadPriorSession) return;
    this.hadPriorSession = true;
    try {
      fs.writeFileSync(this.markerPath, String(Date.now()));
    } catch {
      /* ignore */
    }
  }

  async start(): Promise<void> {
    this.server = net.createServer((sock) => this.onConnect(sock));
    this.server.on('error', (e) => this.logger.error('ws', `server error: ${(e as Error).message}`));
    await new Promise<void>((resolve, reject) => {
      this.server!.once('error', reject);
      this.server!.listen(Config.wsPort, Config.wsHost, () => {
        this.server!.removeListener('error', reject);
        resolve();
      });
    });
    this.setRunning(true);
    this.logger.info('ws', `WS 网关监听 ws://${Config.wsHost}:${Config.wsPort} (subprotocol=${Config.wsSubprotocol})`);
  }

  async stop(): Promise<void> {
    this.setRunning(false);
    for (const sock of this.sockets.values()) {
      try { sock.destroy(); } catch { /* ignore */ }
    }
    this.sockets.clear();
    if (this.server) {
      await new Promise<void>((r) => this.server!.close(() => r()));
    }
    this.recorder.close();
  }

  private onConnect(sock: net.Socket): void {
    const connId = `c${String(++this.connCounter).padStart(3, '0')}`;
    // 多连接场景不再有「单活跃连接」概念；「重连会话」仅用于日志标记。
    const isReconnect = this.hadPriorSession;
    this.sockets.set(connId, sock);
    this.logger.info(
      'ws',
      `[${connId}] 新连接 ${sock.remoteAddress}:${sock.remotePort}${isReconnect ? ' (重连会话)' : ' (首连)'} 在线=${this.sockets.size}`,
    );

    sock.on('error', (e) => this.logger.warn('ws', `[${connId}] socket error: ${(e as Error).message}`));
    sock.on('close', () => {
      this.sockets.delete(connId);
      this.logger.info('ws', `[${connId}] 断开 在线=${this.sockets.size}`);
      if (this.onConnClose) this.onConnClose(connId);
    });

    this.handshake(sock, connId)
      .then((leftover) => {
        if (leftover === null) {
          sock.destroy();
          return;
        }
        // 标记本进程已有过连接（日志用）
        this.markPriorSession();
        // 登记 Client（仅握手成功后才视为有效连接）
        if (this.onConnCreate) this.onConnCreate(connId);
        // 下发 CONNECTION_REQUEST_ACCEPTED (msg1)
        this.sendFrame(sock, 0x2, buildConnectionAccepted());
        this.logger.info('ws', `[${connId}] 已下发 CONNECTION_REQUEST_ACCEPTED`);
        this.readLoop(sock, connId, leftover);
      })
      .catch((e) => {
        this.logger.error('ws', `[${connId}] 握手失败: ${(e as Error).message}`);
        sock.destroy();
      });
  }

  /** 完成握手，返回握手头部之后的剩余字节（可能是首个 WS 帧，交给 readLoop）。 */
  private async handshake(sock: net.Socket, connId: string): Promise<Buffer | null> {
    const data = await this.readUntil(sock, '\r\n\r\n');
    if (!data) return null;
    const headerBlob = data.toString('latin1');
    const lines = headerBlob.split('\r\n');
    const headers: Record<string, string> = {};
    for (const line of lines.slice(1)) {
      const idx = line.indexOf(':');
      if (idx > 0) headers[line.slice(0, idx).trim().toLowerCase()] = line.slice(idx + 1).trim();
    }
    const key = headers['sec-websocket-key'];
    if (!key) {
      sock.write('HTTP/1.1 400 Bad Request\r\n\r\n');
      return null;
    }
    const accept = crypto.createHash('sha1').update(key + WS_GUID).digest('base64');
    const subproto = headers['sec-websocket-protocol'] || '';
    const resp = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${accept}`,
    ];
    if (subproto) resp.push(`Sec-WebSocket-Protocol: ${subproto}`); // ★回显，否则客户端判握手失败
    resp.push('', '');
    sock.write(resp.join('\r\n'));

    const idx = data.indexOf('\r\n\r\n');
    const leftover = data.subarray(idx + 4);
    this.logger.info('ws', `[${connId}] 握手成功 subproto=${subproto}`);
    return leftover;
  }

  private readUntil(sock: net.Socket, terminator: string): Promise<Buffer | null> {
    return new Promise((resolve) => {
      const chunks: Buffer[] = [];
      const onData = (chunk: Buffer) => {
        chunks.push(chunk);
        const all = Buffer.concat(chunks);
        if (all.includes(terminator)) {
          cleanup();
          resolve(all);
        }
      };
      const onErr = () => {
        cleanup();
        resolve(null);
      };
      const cleanup = () => {
        sock.removeListener('data', onData);
        sock.removeListener('error', onErr);
      };
      sock.on('data', onData);
      sock.on('error', onErr);
    });
  }

  private readLoop(sock: net.Socket, connId: string, initial: Buffer): void {
    let buf = initial;
    sock.on('data', (chunk: Buffer) => {
      buf = Buffer.concat([buf, chunk]);
      // 尽量多地解析完整 WS 帧
      while (true) {
        if (buf.length < 2) break;
        const b0 = buf[0];
        const b1 = buf[1];
        const opcode = b0 & 0x0f;
        const masked = (b1 & 0x80) !== 0;
        let len = b1 & 0x7f;
        let offset = 2;
        if (len === 126) {
          if (buf.length < 4) break;
          len = buf.readUInt16BE(2);
          offset = 4;
        } else if (len === 127) {
          if (buf.length < 10) break;
          len = Number(buf.readBigUInt64BE(2));
          offset = 10;
        }
        let mask: Buffer | null = null;
        if (masked) {
          if (buf.length < offset + 4) break;
          mask = buf.subarray(offset, offset + 4);
          offset += 4;
        }
        if (buf.length < offset + len) break;
        let payload = buf.subarray(offset, offset + len);
        if (mask) {
          const u = Buffer.allocUnsafe(len);
          for (let i = 0; i < len; i++) u[i] = payload[i] ^ mask[i & 3];
          payload = u;
        }
        buf = buf.subarray(offset + len);
        this.onClientFrame(sock, connId, opcode, payload);
      }
    });
  }

  private onClientFrame(sock: net.Socket, connId: string, opcode: number, payload: Buffer): void {
    if (opcode === 0x8) {
      // close
      try { this.sendFrame(sock, 0x8, Buffer.alloc(0)); } catch { /* ignore */ }
      sock.destroy();
      return;
    }
    if (opcode === 0x9) {
      // ping -> pong
      try { this.sendFrame(sock, 0xa, payload); } catch { /* ignore */ }
      return;
    }
    if (opcode === 0xa) return; // pong
    // 0x1/0x2: 客户端 C2S（IFix JIT 内联加密 → 密文）。★C2S 解密直读（脱离 Frida 的关键）。
    // this.recorder.record(connId, 'C2S', payload);
    let recData:any={raw: payload.toString('hex')};
    const started = Date.now();
    const dec = decryptC2S(payload);
    let isrecorded=false;
    if (dec) {
      const cost = Date.now() - started;
      this.logger.info(
        'ws',
        `[${connId}] C2S解密 msgId=${dec.msgId} order=${dec.order} body=${dec.body
          .slice(0, 24)
          .toString('hex')} (${cost}ms)`,
      );
      recData.msgId=dec.msgId;
      recData.order=dec.order;
      this.recorder.record(connId, 'C2S', dec.body,recData);
      isrecorded=true;
      if (this.onC2S) {
        const frames = this.onC2S(connId, dec);
        for (const f of frames) this.sendS2C(connId, f);
      }
    } else {
      this.logger.warn(
        'ws',
        `[${connId}] C2S解密失败 len=${payload.length} hex=${payload.slice(0, 24).toString('hex')} (${Date.now() - started}ms)`,
      );
    }

    if (!isrecorded) {
      delete recData.raw;
      this.recorder.record(connId, 'C2S', payload,recData);
    }
    
  }

  /** 下发一条 S2C 帧到指定连接（目标连接不存在则丢弃并告警）。 */
  sendS2C(connId: string, frame: S2CFrame): void {
    const sock = this.sockets.get(connId);
    if (!sock) {
      this.logger.warn('ws', `[${connId}] sendS2C 连接已不存在，丢弃 msgId=${frame.msgId}`);
      return;
    }
    const bytes = buildS2C(frame.msgId, frame.order, frame.body);
    this.recorder.record(connId, 'S2C', bytes,{msgId: frame.msgId, order: frame.order});
    this.sendFrame(sock, 0x2, bytes);
  }

  /** 发送 RFC6455 帧（server→client，FIN=1，不加 mask）。 */
  private sendFrame(sock: net.Socket, opcode: number, payload: Buffer): void {
    const b0 = 0x80 | (opcode & 0x0f);
    const n = payload.length;
    let header: Buffer;
    if (n < 126) {
      header = Buffer.from([b0, n]);
    } else if (n < 65536) {
      header = Buffer.allocUnsafe(4);
      header[0] = b0;
      header[1] = 126;
      header.writeUInt16BE(n, 2);
    } else {
      header = Buffer.allocUnsafe(10);
      header[0] = b0;
      header[1] = 127;
      header.writeBigUInt64BE(BigInt(n), 2);
    }
    sock.write(Buffer.concat([header, payload]));
  }
}
