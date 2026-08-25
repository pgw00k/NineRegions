/**
 * MessageRegistry.ts — 加载 message-registry.json（由 tools/extract_registry.py 生成）。
 *
 * 该注册表是「消息号 <-> protobuf 类型名」的权威来源（来自 204 个 NetMsg_*.lua 的
 * NetMetaDefine 桥接，因为 native 层 DynamicProtoFactory 不可见）。本服务用它确定
 * REQ/REP 配对（responseId）。注意：native 消息（如 10011/10012）无对应 lua，注册表缺条目，
 * 那种情况由路由层用通用 +1 配对兜底。
 */
import * as fs from 'fs';
import { REGISTRY_PATH_ABS } from '../config/env';

export interface MessageMeta {
  id: number;
  name: string;
  category: string;
  direction: string;
  proto: string;
  responseId?: number | null;
  requestId?: number | null;
}

interface RegistryFile {
  messages: Record<string, MessageMeta>;
}

export class MessageRegistry {
  private byId = new Map<number, MessageMeta>();

  static load(path: string): MessageRegistry {
    const raw = JSON.parse(fs.readFileSync(path, 'utf-8')) as RegistryFile;
    const reg = new MessageRegistry();
    for (const key of Object.keys(raw.messages)) {
      const meta = raw.messages[key];
      reg.byId.set(meta.id, meta);
    }
    return reg;
  }

  /** 取消息元信息。 */
  get(msgId: number): MessageMeta | undefined {
    return this.byId.get(msgId);
  }

  /** 取该 REQ 对应的 REP 消息号（无则返回 undefined，由路由层用 +1 兜底）。 */
  responseId(msgId: number): number | undefined {
    const m = this.byId.get(msgId);
    return m && m.responseId ? m.responseId : undefined;
  }

  get size(): number {
    return this.byId.size;
  }
}
