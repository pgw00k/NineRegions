/**
 * FrameRecorder.ts — 全量帧记录（镜像参考网关 captures/gw_YYYYMMDD.jsonl）。
 *
 * 用于离线比对客户端日志、定位协议问题。每条记录含时间戳 / 连接 / 方向 / 长度 / hex / ascii。
 * 通过环境变量 RECORD_FRAMES 关闭。
 */
import * as fs from 'fs';
import * as path from 'path';
import { LOG_DIR_ABS } from '../config/env';
import { Logger } from '../core/Logger';

export type FrameDir = 'C2S' | 'S2C' | 'WS_HANDSHAKE' | 'RAW' | 'FIRST_C2S';

export class FrameRecorder {
  private stream: fs.WriteStream | null = null;
  private readonly dateStr: string;

  constructor(
    private readonly logger: Logger,
    private readonly enabled: boolean,
  ) {
    this.dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    if (this.enabled) this.ensure();
  }

  private ensure(): void {
    try {
      fs.mkdirSync(LOG_DIR_ABS, { recursive: true });
      const file = path.join(LOG_DIR_ABS, `gw_${this.dateStr}.jsonl`);
      this.stream = fs.createWriteStream(file, { flags: 'a' });
      this.logger.info(`帧记录 -> ${file}`);
    } catch (e) {
      this.logger.warn('FrameRecorder 初始化失败', String(e));
    }
  }

  record(
    connId: string,
    dir: FrameDir,
    payload: Buffer,
    extra?: Record<string, unknown>,
  ): void {
    if (!this.enabled || !this.stream) return;
    const rec: Record<string, unknown> = {
      ts: new Date().toISOString(),
      conn: connId,
      dir,
      len: payload.length,
      hex: payload.toString('hex'),
    };
    try {
      rec.ascii = payload.toString('latin1');
    } catch {
      /* ignore */
    }
    if (extra) Object.assign(rec, extra);
    this.stream.write(JSON.stringify(rec) + '\n');
  }

  close(): void {
    if (this.stream) {
      this.stream.end();
      this.stream = null;
    }
  }
}
