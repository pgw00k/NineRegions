/**
 * PlainChannel.ts — UDP 明文侧信道（Frida 明文帧的接收端）。
 *
 * 运行时链路（参考 HANDOFF.md §6.5）：
 *   客户端 WebSocketClient.Send(明文帧) --Frida hook--> UDP 127.0.0.1:9002 --> 本通道
 *   本通道 parsePlain 解出 (msgId, order, body)，交给上层路由产出 S2C 帧，
 *   再由 WsGateway.sendS2C 经活跃 WS 连接下发（客户端 Recv 不解密，正常处理）。
 *
 * 这样绕过了 C2S 的 IFix JIT 内联加密（静态不可还原），是本服务能真正应答的关键。
 */
import * as dgram from 'dgram';
import { Buffer } from 'buffer';
import { Server } from '../core/Server';
import { Logger } from '../core/Logger';
import { Config } from '../config/env';
import { parsePlain } from './FrameCodec';
import { S2CFrame } from '../messages/types';

export interface PlainChannelDeps {
  /** 取当前活跃 WS 连接 id（order 跟踪需与之对应）。 */
  getActiveConnId: () => string;
  /** 下发 S2C 帧（经 WsGateway 活跃连接）。 */
  sendS2C: (frame: S2CFrame) => void;
  /** 路由一条 C2S，返回要下发的 S2C 帧。 */
  onMessage: (connId: string, msgId: number, order: number, body: Buffer) => S2CFrame[];
}

export class PlainChannel extends Server {
  private socket?: dgram.Socket;

  constructor(logger: Logger, private readonly deps: PlainChannelDeps) {
    super('plain', logger);
  }

  async start(): Promise<void> {
    this.socket = dgram.createSocket('udp4');
    this.socket.on('error', (e) => this.logger.error('plain', `socket error: ${(e as Error).message}`));
    await new Promise<void>((resolve, reject) => {
      this.socket!.once('error', reject);
      this.socket!.bind(Config.plainUdpPort, Config.plainUdpHost, () => {
        this.socket!.removeListener('error', reject);
        resolve();
      });
    });
    this.setRunning(true);
    this.socket.on('message', (msg) => this.onUdp(msg));
    this.logger.info('plain', `明文侧信道监听 udp://${Config.plainUdpHost}:${Config.plainUdpPort}`);
  }

  async stop(): Promise<void> {
    this.setRunning(false);
    if (this.socket) {
      await new Promise<void>((r) => this.socket!.close(() => r()));
    }
  }

  private onUdp(data: Buffer): void {
    const parsed = parsePlain(data);
    if (!parsed) return;
    const { msgId, order, body } = parsed;
    const connId = this.deps.getActiveConnId() || 'plain';
    this.logger.info(
      'plain',
      `[${connId}] RAW(${data.length}B) msgId=${msgId} order=${order} body=${body.slice(0, 24).toString('hex')}`,
    );
    const frames = this.deps.onMessage(connId, msgId, order, body);
    for (const f of frames) this.deps.sendS2C(f);
  }
}
