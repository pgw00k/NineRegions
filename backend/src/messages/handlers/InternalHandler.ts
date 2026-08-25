/**
 * InternalHandler.ts — 处理内部消息（1/2/3/4/7）。
 *
 * 这些 RakNet 风格连接层消息不携带业务 protobuf；收到后回显「同号 + 空体」。
 * 典型：PINGPONG(7) 心跳保活，客户端发 7 我们回 7 空体。连接建立后的 msg1 由
 * WsGateway 主动下发，不在此处理。
 */
import { Buffer } from 'buffer';
import { MessageHandler, HandlerContext, S2CFrame, INTERNAL_MSG_IDS, buildResponseFrame } from '../types';

export class InternalHandler extends MessageHandler {
  match(ctx: HandlerContext): boolean {
    return INTERNAL_MSG_IDS.has(ctx.msgId);
  }

  handle(ctx: HandlerContext): S2CFrame[] {
    // 内部消息回显同号空体（buildResponseFrame 会按 repMsgId=自身判定不包 dynproto）
    return [buildResponseFrame(ctx, Buffer.alloc(0))];
  }
}
