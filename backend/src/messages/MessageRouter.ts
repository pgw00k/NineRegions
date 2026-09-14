/**
 * MessageRouter2.ts — 消息路由核心链路。
 *
 *   C2S（已解密）→ 解码为对象 → 交给 MessageController（Auto）应答器 Handle
 *   → 得到返回对象 → 编码 → 发回客户端。
 *
 * 设计约束：
 *  - 全程只依赖共享层的静态编解码与注册表（mc-local-share），不在本文件碰操作号之外
 *    的业务细节；
 *  - 不做业务特判，但负责「order 基准同步」：收到逻辑区间 C2S 时把客户端逻辑基准（Client.order）
 *    对齐到该 C2S 的 order，具体 +1 记账由 Client.pushFrame 完成（战斗区间走独立空间，不同步）；
 *  - 解码/编码/处理任一环节失败即静默丢弃该请求。
 */
import { Buffer } from 'buffer';
import { get, decodeMessage, MESSAGE_ID } from 'mc-local-share';
import { Logger } from '../core/Logger';
import { DecodedC2S, S2CFrame } from './types';
import { MessageControllerMod } from '../net/msg_mod/MessageControllerMod';
import { ConnManager } from '../net/ConnManager';
import { Client } from '../net/Client';
import { MESSAGE_SET_CONNECT } from './MESSAGE_ID.SET';

export class MessageRouter {
  private readonly controller = new MessageControllerMod();

  /**
   * @param conns  多客户端连接管理器（按 connId/uid 定位 Client）。
   * @param logger 日志器。
   */
  constructor(
    private readonly conns: ConnManager,
    private readonly logger?: Logger,
  ) { }

  /**
   * 路由一条已解密的 C2S。
   * @param connId 来源连接（据此定位该客户的 Client）。
   * @param frame 已解码的 C2S（header.msgId / header.order / envelope / body）。
   * @returns 要下发的 S2C 帧（0 或多条）。
   */
  route(connId: string, frame: DecodedC2S): Promise<S2CFrame[]> | S2CFrame[] {
    // 定位当前客户端上下文；若首条消息已带 uid，则绑定到 Client。
    // 该 Client 持有本次请求的应答器处理、order 记账与 S2C 帧队列（见 Client.process）。
    const client = this.conns.get(connId);
    const { msgId, order} = frame.header;
    const {uid,token} = frame.envelope;
    const {body} = frame;
    this.prebindUid(connId, client, uid);

    // 同步 order 基准：客户端发出逻辑 order=n 后本地 logicOrder 推进到 n，之后期待 S2C 为 n+1。
    // 只对「逻辑区间」同步 —— 战斗区间（msgId >= BATTLE_MESSAGE_BEGIN，如 25001）走客户端
    // 独立的 battleOrder 空间，其 order 与逻辑序列无关，若在此同步会把逻辑基准顶高一格，
    // 导致后续心跳应答跳号被客户端丢弃（实证 gw_20260911.jsonl 第 1085 行 `C2S 25001 order=8`
    // 之后 `S2C 10004` 变为 10/11）。
    // 同理，PINGPONG（msgId < ACCOUNT_MESSAGE_BEGIN）order 恒为 0，不参与业务递增。
    if (client && msgId >= MESSAGE_ID.LOGIC_MESSAGE_BEGIN && msgId < MESSAGE_ID.BATTLE_MESSAGE_BEGIN) {
      client.syncOrder(order);
    }

    // 第一层过滤：网络层内部消息（msgId < ACCOUNT_MESSAGE_BEGIN，目前只有 PINGPONG=7）。
    // 这类消息不进入业务应答器，但客户端要求「收到一条同号回包」才算心跳存活 ——
    // 实证见 logs/develop.jsonl：C2S msg=7 order=0 → S2C msg=7 order=0（bodyLen=0 空体，
    // order 原样沿用，不 +1）。若此处不回，客户端会持续重发心跳并最终判定掉线。
    // 用 echoFrame 而非 pushFrame：既不推进服务端 order 记账，也不污染业务 order 序列
    // （客户端侧 PINGPONG 的 order 恒为 0，不参与业务递增）。
    if (msgId < MESSAGE_ID.ACCOUNT_MESSAGE_BEGIN) {
      if (!client) {
        return [{ msgId, order, body: Buffer.alloc(0) }];
      }
      client.echoFrame(msgId, order, Buffer.alloc(0));
      return client.drainPending();
    }

    // 解码 REQ：按请求消息号取静态 schema → 字段名对象
    let req: Record<string, unknown> = {};
    const reqSchema = get(msgId);
    if (reqSchema) {
      try {
        // 解码业务体
        req = decodeMessage(reqSchema, stripNetBitStream(body)) as Record<string, unknown>;
      } catch (e) {
        this.logger?.warn('router', `[${connId}] 解码 req#${msgId} 失败: ${(e as Error).message}`);
        return Promise.resolve([]);
      }
    }else{
      this.logger?.warn('router', `[${connId}] 解码 req#${msgId} 失败: 未注册解码器`);
    }
    // this.logger?.info(`router [${connId}] 解码 req#${msgId} 结果:`, req);

    // 交给 Client 判断应答器并处理（dispatch / Handle / 编码 / 记账 / 排队都在 Client 内完成），
    // 返回待下发帧。事件驱动：请求处理完成即取帧，无定时遍历。
    // Handle 可能异步查询数据库，route 保持 Promise 透传，由 WsGateway await 后下发。
    if (!client){
      this.logger?.warn('router', `[${connId}] 未绑定clients uid=${uid}`);
      return Promise.resolve([]);
    }
    return client.process(req, order, msgId, uid, token, this.controller);
  }

  /**
   * 用解密阶段已解析出的 uid 绑定到 Client（一次绑定后不再重复绑定）。
   * 这样后续每条消息都能用 `client.uid` / `ConnManager.byUidLookup` 定位玩家，
   * 无需再对 body 作 NetBitStream 二次解析。
   */
  private prebindUid(connId: string, client: Client | undefined, uid?: string): void {
    if (!client || client.uid || !uid) return;
    this.conns.bind(connId, uid);
    this.logger?.info('router', `[${connId}] 绑定玩家 uid=${uid}`);
  }
}

/**
 * 剥离客户端 C2S 业务体前的 NetBitStream 信封，剩余为纯 protobuf。
 *
 * 信封结构（实证，EnterGame 帧）：
 *   [u16 len][userId 数字串]（len 为实际字节数，不固定为 17；17 字节 uid 时即 11 00）
 *   [u16 len][token 字符串]
 *   [u32 len][protobuf]
 * 仅含 userId（心跳类，msgId=7）时只有第一段，无 protobuf。
 * 返回：跳过 userId/token 段及 u32 长度后的 protobuf；无 protobuf 则返回空。
 */
function stripNetBitStream(body: Buffer): Buffer {
  let off = 0;
  const n = body.length;

  // ① userId 段：[u16 len][len 字节数字串]。长度随 uid 动态变化，按前缀读实际长度；
  //    段内容须为 ASCII 数字串且长度自洽，否则视为无信封（纯 protobuf）原样返回。
  if (n < 2) return body;
  const userIdLen = body.readUInt16LE(0);
  if (userIdLen < 1 || 2 + userIdLen > n) return body;
  for (let i = 2; i < 2 + userIdLen; i++) {
    const c = body[i];
    if (c < 0x30 || c > 0x39) return body;
  }
  off = 2 + userIdLen;
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