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
import { get, decodeMessage, MESSAGE_ID } from 'mc-local-share';
import { Logger } from '../core/Logger';
import { S2CFrame } from './types';
import { MessageControllerMod } from '../net/msg_mod/MessageControllerMod';
import { ConnManager } from '../net/ConnManager';
import { Client } from '../net/Client';
import { UserStateStore } from '../state/UserState';

export class MessageRouter {
  private readonly controller = new MessageControllerMod();

  /**
   * @param conns  多客户端连接管理器（按 connId/uid 定位 Client）。
   * @param logger 日志器。
   */
  constructor(
    private readonly conns: ConnManager,
    private readonly logger?: Logger,
  ) {}

  /**
   * 路由一条已解密的 C2S。
   * @param connId 来源连接（据此定位该客户的 Client）。
   * @param msgId 解密后的请求消息号（reqId）。
   * @param order C2S 的 order；应答帧使用 order + 1。
   * @param body  解密后、含 NetBitStream 前缀的业务体。
   * @returns 要下发的 S2C 帧（0 或 1 条）。
   */
  route(connId: string, msgId: number, order: number, body: Buffer): S2CFrame[] {
    // 定位当前客户端上下文；若首条消息已带 uid，则绑定到 Client。
    // 该 Client 持有本次请求的应答器处理、order 记账与 S2C 帧队列（见 Client.process）。
    const client = this.conns.get(connId);
    this.prebindUid(connId, client, body);

    // 第一层过滤：无需进入 Client 应答处理的消息（如心跳 PINGPONG）。
    // 无 protobuf、无应答器 → 直接往 Client 队列推 8B 空体
    // （若 Buffer.alloc(0)，客户端判 MsgBodyExists=False 拒读），order 不变。
    if (msgId == MESSAGE_ID.PINGPONG) {
      if (client) {
        client.beginRequest(order);
        client.pushFrame(msgId, Buffer.alloc(8));
      }
      return client ? client.drainPending() : [{ msgId, order: order, body: Buffer.alloc(8) }];
    }

    // 解码 REQ：按请求消息号取静态 schema → 字段名对象
    let req: Record<string, unknown> = {};
    const reqSchema = get(msgId);
    if (reqSchema) {
      try {
        req = decodeMessage(reqSchema, stripNetBitStream(body)) as Record<string, unknown>;
      } catch (e) {
        this.logger?.warn('router', `[${connId}] 解码 req#${msgId} 失败: ${(e as Error).message}`);
        return [];
      }
    }

    // 交给 Client 判断应答器并处理（dispatch / Handle / 编码 / 记账 / 排队都在 Client 内完成），
    // 返回待下发帧。事件驱动：请求处理完成即取帧，无定时遍历。
    if (!client) return [];
    return client.process(req, msgId, order, this.controller);
  }

  /**
   * 从首条消息的 NetBitStream 信封里提取 userID 绑到 Client（一次绑定后不再重复提取）。
   * 这样后续每条消息都能用 `client.uid` / `ConnManager.byUidLookup` 定位玩家。
   */
  private prebindUid(connId: string, client: Client | undefined, body: Buffer): void {
    if (!client || client.uid) return;
    const uid = UserStateStore.extractUserId(body);
    if (!uid) return;
    this.conns.bind(connId, uid);
    this.logger?.info('router', `[${connId}] 绑定玩家 uid=${uid}`);
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