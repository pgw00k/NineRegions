/**
 * Logger.ts — 统一日志。
 *
 * OOP 设计：每个子系统持有一个带名字的 Logger 实例，便于在日志里区分来源。
 * 支持级别过滤（debug/info/warn/error），并统一时间戳格式。
 *
 * 额外：所有日志同时追加到 <cwd>/logs/server.log（UTF-8），
 * 便于服务在「可见控制台窗口」运行时仍能从文件侧复查。
 */
import * as fs from 'fs';
import * as path from 'path';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export class Logger {
  private static fileFd: number | null = null;

  private minLevel: number;

  constructor(
    public readonly name: string,
    minLevel: LogLevel = 'info',
  ) {
    this.minLevel = LEVEL_WEIGHT[minLevel];
  }

  /** 惰性打开日志文件（<cwd>/logs/server.log，追加）。失败静默降级为仅控制台。 */
  private static ensureFile(): void {
    if (Logger.fileFd !== null) return;
    try {
      const dir = path.join(process.cwd(), 'logs');
      fs.mkdirSync(dir, { recursive: true });
      Logger.fileFd = fs.openSync(path.join(dir, 'server.log'), 'a');
    } catch {
      Logger.fileFd = -1;
    }
  }

  private now(): string {
    // 与参考网关一致：ISO 微秒，便于对照客户端日志时间线
    return new Date().toISOString().replace('Z', '');
  }

  private emit(level: LogLevel, msg: string, extra?: unknown): void {
    if (LEVEL_WEIGHT[level] < this.minLevel) return;
    const head = `[${this.now()}] [${level.toUpperCase()}] [${this.name}]`;
    const line = extra !== undefined ? `${head} ${msg} ${safeStringify(extra)}` : `${head} ${msg}`;
    if (level === 'error') {
      // eslint-disable-next-line no-console
      console.error(line);
    } else if (level === 'warn') {
      // eslint-disable-next-line no-console
      console.warn(line);
    } else {
      // eslint-disable-next-line no-console
      console.log(line);
    }
    Logger.ensureFile();
    if (Logger.fileFd !== null && Logger.fileFd >= 0) {
      try {
        fs.writeSync(Logger.fileFd, line + '\n');
      } catch {
        /* ignore */
      }
    }
  }

  debug(msg: string, extra?: unknown): void {
    this.emit('debug', msg, extra);
  }
  info(msg: string, extra?: unknown): void {
    this.emit('info', msg, extra);
  }
  warn(msg: string, extra?: unknown): void {
    this.emit('warn', msg, extra);
  }
  error(msg: string, extra?: unknown): void {
    this.emit('error', msg, extra);
  }
}

function safeStringify(v: unknown): string {
  try {
    if (typeof v === 'string') return v;
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}
