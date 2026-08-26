/**
 * MockLoader.ts — 加载「以消息号命名的 mock JSON」并编码为裸 protobuf。
 *
 * mock JSON 约定（字段号 keyed，规避 protobufjs 字段名歧义）：
 *  - "$type": 必填，protobuf 消息短名（如 "EnterGameResponse"），用于定位 schema；
 *  - 其余 key 为字段号（字符串），值为字段内容（嵌套对象 / 数组 / 标量）；
 *  - 支持占位符（字符串值）："@now"(秒) "@nowMs" "@gameHost" "@gamePort" "@gameVer"。
 *
 * 文件命名：mocks/<repMsgId>.json，例如 mocks/10002.json 对应 EnterGameResponse。
 * 这种「单文件模拟单消息」的方式便于覆盖海量业务消息：丢一个 JSON 即生效。
 */
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../core/Logger';
import { Config } from '../config/env';
import { SchemaRegistry } from '../proto/SchemaRegistry';
import { ProtobufEncoder } from '../proto/ProtobufEncoder';

export class MockLoader {
  constructor(
    private readonly dir: string,
    private readonly schema: SchemaRegistry,
    private readonly encoder: ProtobufEncoder,
    private readonly logger: Logger,
  ) {}

  /** 是否存在某应答消息号的 mock 文件。 */
  exists(repMsgId: number): boolean {
    return fs.existsSync(this.pathFor(repMsgId));
  }

  private pathFor(repMsgId: number): string {
    return path.join(this.dir, `${repMsgId}.json`);
  }

  /**
   * 加载并编码为裸 protobuf（不包 dynproto）。失败抛错，由调用方决定是否降级。
   */
  load(repMsgId: number): Buffer {
    const raw = this.loadRaw(repMsgId);
    // ★$hex 模式：直接返回裸 protobuf 字节（内体，不含 10B 头、不含 dynproto），
    // 用于「从真实服务端抓包原样复用响应体」的场景（如战斗开始/结算），避免 schema 猜测。
    if (typeof raw.$hex === 'string' && raw.$hex.length > 0) {
      return Buffer.from(raw.$hex, 'hex');
    }
    const typeName = raw.$type;
    if (typeof typeName !== 'string' || !typeName) {
      throw new Error(`mock ${repMsgId}.json 缺少 $type 字段`);
    }
    const mschema = this.schema.getByShortName(typeName);
    if (!mschema) {
      throw new Error(`mock ${repMsgId}.json 的 $type=${typeName} 在 schema 中不存在`);
    }
    const obj = this.applyPlaceholders(raw) as Record<string, unknown>;
    delete obj.$type;
    return this.encoder.encode(mschema, obj);
  }

  /**
   * 加载 mock JSON 原始对象（未替换占位符、未删 $type/$hex）。
   * 供需要「基于骨架动态覆写」的处理器（如 GameDataHandler 注入账号数据）复用。
   */
  loadObject(repMsgId: number): Record<string, unknown> {
    const raw = this.loadRaw(repMsgId);
    if (typeof raw.$hex === 'string' && raw.$hex.length > 0) {
      return {}; // $hex 模式无骨架可用，返回空对象由调用方自行处理
    }
    return this.applyPlaceholders(raw) as Record<string, unknown>;
  }

  /** 读取原始 JSON（不替换占位符）。 */
  private loadRaw(repMsgId: number): Record<string, unknown> {
    const p = this.pathFor(repMsgId);
    return JSON.parse(fs.readFileSync(p, 'utf-8')) as Record<string, unknown>;
  }

  /** 递归替换占位符字符串。 */
  private applyPlaceholders(node: unknown): unknown {
    if (typeof node === 'string') {
      switch (node) {
        case '@now': return Math.floor(Date.now() / 1000);
        case '@nowMs': return Date.now();
        case '@gameHost': return Config.gameHost;
        case '@gamePort': return Config.gamePort;
        case '@gameVer': return Config.gameVer;
        default: return node;
      }
    }
    if (Array.isArray(node)) return node.map((x) => this.applyPlaceholders(x));
    if (node && typeof node === 'object') {
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(node as Record<string, unknown>)) {
        out[k] = this.applyPlaceholders((node as Record<string, unknown>)[k]);
      }
      return out;
    }
    return node;
  }
}
