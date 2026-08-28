/**
 * MessageRouter2.ts — 消息路由核心链路。
 *
 *   C2S（已解密）→ 解码为对象 → 交给 MessageController（Auto）应答器 Handle
 *   → 得到返回对象 → 编码 → 发回客户端。
 *
 * 设计约束：
 *  - 全程只依赖共享层的静态编解码与注册表（mc-local-share），不在本文件碰操作号之外
 *    的业务细节；
 *  - 不做任何附加业务（无 INTERNAL 特判、无 order 增/减）。每条 C2S 至多产出一条 S2C；
 *  - 解码/编码/处理任一环节失败即静默丢弃该请求。
 */
import { Buffer } from 'buffer';
import type { MESSAGE_ID } from 'mc-local-share';
import { get, encodeMessage, decodeMessage } from 'mc-local-share';
import { Logger } from '../core/Logger';
import { MessageController } from '../net/msg/MessageController';
import { wrapDynProtoAuto } from '../net/FrameCodec';
import { S2CFrame } from './types';

/** Auto 应答器在路由视角的最小契约。 */
interface AutoResponder {
  reqId: number;
  recId: number;
  Handle(req: Record<string, unknown>): Record<string, unknown>;
}

export class MessageRouter2 {
  private readonly controller = new MessageController();

  constructor(private readonly logger?: Logger) {}

  /**
   * 路由一条已解密的 C2S。
   * @param msgId 解密后的请求消息号（reqId）。
   * @param order C2S 的 order；应答帧使用 order + 1。
   * @param body  解密后、含 NetBitStream 前缀的业务体。
   * @returns 要下发的 S2C 帧（0 或 1 条）。
   */
  route(connId: string, msgId: number, order: number, body: Buffer): S2CFrame[] {
    const responder = this.controller.AutoResponser[msgId as MESSAGE_ID] as AutoResponder | undefined;
    if (!responder) {
      // Auto 未注册 → 不应答
      return [];
    }

    // ① 解码 REQ：按请求消息号取静态 schema（字段号/类型表）→ 字段名对象
    let req: Record<string, unknown> = {};
    const reqSchema = get(msgId);
    if (reqSchema) {
      try {
        req = decodeMessage(reqSchema, stripNetBitStream(body)) as Record<string, unknown>;
      } catch (e) {
        this.logger?.warn('router', `[${connId}] 解码 req#${msgId} 失败: ${(e as Error).message}`);
      }
    }

    // ② 交给 Auto 处理，取得返回对象
    let rep: Record<string, unknown>;
    try {
      rep = responder.Handle(req) ?? {};
    } catch (e) {
      this.logger?.warn('router', `[${connId}] 处理 req#${msgId} 异常: ${(e as Error).message}`);
      return [];
    }

    // ③ 编码 REP → dynproto 体 → 生成 S2C 帧（应答号用应答器 recId，order = C2S order + 1）
    const repSchema = get(Number(responder.recId));
    if (!repSchema) return [];
    try {
      const inner = encodeMessage(repSchema, rep);
      return [{ msgId: Number(responder.recId), order: order + 1, body: wrapDynProtoAuto(inner) }];
    } catch (e) {
      this.logger?.warn('router', `[${connId}] 编码 rec#${responder.recId} 失败: ${(e as Error).message}`);
      return [];
    }
  }
}

/**
 * 剥离客户端 C2S 业务体前的 NetBitStream 信封，剩余为纯 protobuf。
 *
 * 信封结构（实证，EnterGame 帧）：
 *   [11 00][u16 len][userId 数字串]
 *   [u16 len][token 字符串]
 *   [u32 len][protobuf]
 * 仅含 userId（心跳类，msgId=7）时只有第一段，无 protobuf。
 * 返回：跳过 userId/token 段及 u32 长度后的 protobuf；无 protobuf 则返回空。
 */
function stripNetBitStream(body: Buffer): Buffer {
  let off = 0;
  const n = body.length;

  // ① userId 段：[11 00][u16 len][len 字节数字串]。非 11 起头则原样返回。
  if (n < 2 || body[0] !== 0x11 || body[1] !== 0x00) return body;
  const userIdLen = body.readUInt16LE(0);
  off = 2 + userIdLen;
  if (off > n) return Buffer.alloc(0);
  if (off === n) return Buffer.alloc(0); // 只有 userId 段（心跳），无业务 protobuf

  // ② token 段：[u16 len][len 字节字符串]。长度须自洽，否则视为已到 protobuf。
  if (n >= off + 2) {
    const tokenLen = body.readUInt16LE(off);
    if (tokenLen > 0 && off + 2 + tokenLen <= n) {
      off += 2 + tokenLen;
    }
  }

  // ③ u32 长度前缀：[u32 len][len 字节 protobuf]。越界则原样截取到剩余。
  if (n >= off + 4) {
    const protoLen = body.readUInt32LE(off);
    if (protoLen > 0 && off + 4 + protoLen <= n) {
      off += 4;
    }
  }

  return body.subarray(off);
}