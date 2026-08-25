/**
 * types.ts — 消息层公共类型与应答帧构造。
 *
 *  - S2CFrame: 一条要下发的 S2C 帧（msgId/order/body）。
 *  - HandlerContext: 处理器上下文（收到的 C2S 信息 + 共享服务）。
 *  - MessageHandler: 处理器抽象基类（OOP 继承/多态），子类实现 match + handle。
 *  - buildResponseFrame: 统一的「构造一条应答帧」逻辑（order 跟踪 + dynproto 包裹）。
 */
import { Buffer } from 'buffer';
import { SchemaRegistry } from '../proto/SchemaRegistry';
import { ProtobufEncoder } from '../proto/ProtobufEncoder';
import { OrderTracker } from '../net/OrderTracker';
import { MessageRegistry } from './MessageRegistry';
import { Storage } from '../storage/Storage';
import { Logger } from '../core/Logger';
import { Config } from '../config/env';
import { wrapDynProtoAuto } from '../net/FrameCodec';
import { PveSettlementService } from './PveSettlement';
import { UserStateStore } from '../state/UserState';

/** 一条 S2C 帧（未包 WS 头；WsGateway 负责加 RFC6455 帧头）。 */
export interface S2CFrame {
  msgId: number;
  order: number;
  body: Buffer;
}

/** 共享服务（注入各处理器，避免全局单例、便于替换/测试）。 */
export interface HandlerServices {
  schema: SchemaRegistry;
  encoder: ProtobufEncoder;
  orders: OrderTracker;
  registry: MessageRegistry;
  storage: Storage;
  logger: Logger;
  config: typeof Config;
  /** 服务端主动推送一条 S2C（order 自动递增；逻辑消息自动包 dynproto）。 */
  push: (connId: string, msgId: number, innerPbuf: Buffer) => void;
  /** PVE 结算推送状态机（15003 何时推送、防重复）。 */
  pve: PveSettlementService;
  /** 按用户 ID 的会话状态（重连恢复战斗、起名等）。 */
  users: UserStateStore;
}

/** 处理器上下文：一次 C2S 的处理所需全部信息。 */
export interface HandlerContext {
  connId: string;
  /** 收到的 C2S 消息号。 */
  msgId: number;
  /** 收到的 C2S order。 */
  order: number;
  /** 收到的 C2S 裸 protobuf 体（未 dynproto 包裹）。 */
  body: Buffer;
  /** 计算出的应答消息号（内部消息=自身；否则 responseId ?? msgId+1）。 */
  repMsgId: number;
  services: HandlerServices;
}

/** 内部消息集合（不走 order 校验、回显同号空体）。 */
export const INTERNAL_MSG_IDS = new Set<number>([1, 2, 3, 4, 7]);

/** 消息处理器抽象基类。 */
export abstract class MessageHandler {
  /** 是否由本处理器接管该消息。 */
  abstract match(ctx: HandlerContext): boolean;
  /** 生成要下发的 S2C 帧（可多条，支持服务端主动推送）。 */
  abstract handle(ctx: HandlerContext): S2CFrame[];
}

/**
 * 构造一条 S2C 应答帧。
 *  - order：按 receivedMsgId 类别交给 OrderTracker（内部回显、逻辑递增）。
 *  - 仅在「重连会话」上、repMsgId=15018(BattleStartResponse) 之后把计数器重置为 1，
 *    以对齐客户端重连进战斗后的 logicOrder 重置；首连会话不重置。
 *  - 内部消息（repMsgId ∈ {1,2,3,4,7}）不包 dynproto，body 即 inner；
 *  - raw=true：直接以 inner 为 body（不包 dynproto）——echo 类应答，对齐参考网关
 *    echo_body（真实服务端 15041 echo 为裸请求体，带头会让客户端解析 PushPrizeInfo 失败）；
 *  - 其余逻辑消息用 wrapDynProtoAuto 包裹（空 8B / error-only 28B / 数据包 long 不补零）。
 */
export function buildResponseFrame(ctx: HandlerContext, innerPbuf: Buffer, opts?: { raw?: boolean }): S2CFrame {
  const order = ctx.services.orders.next(ctx.connId, ctx.msgId, ctx.order);
  // ★重连会话：客户端收到 BattleStartResponse(15018) 后会把 logicOrder 重置为 1，
  // 服务端必须同步把本连接计数器重置为 1，使战后首条逻辑消息 order = 2 与客户端对齐。
  // 首连会话的 15018 是剧情跳过（STORY_SKIP），客户端不重置，故仅对重连会话生效。
  if (
    OrderTracker.isBattleStartRep(ctx.repMsgId) &&
    ctx.services.orders.isReconnect(ctx.connId)
  ) {
    ctx.services.orders.resetTo(ctx.connId, OrderTracker.battleStartResetValue);
  }
  const isInternal = INTERNAL_MSG_IDS.has(ctx.repMsgId);
  const body = isInternal || opts?.raw ? innerPbuf : wrapDynProtoAuto(innerPbuf);
  return { msgId: ctx.repMsgId, order, body };
}
