/**
 * EchoHandler.ts — 兜底处理器（排在最后，永远 match）。
 *
 * 对未单独模拟的消息，把收到的 C2S 裸体作为应答（repMsgId = msgId+1），与参考网关
 * smart 模式的 "echo_body" 完全一致：**直接返回裸请求体，不包 dynproto**。
 * （真实服务端 15041 echo 为裸体 40B；包 dynproto 头会让客户端把 `[4B][4B]` 当 protobuf
 * 字段解析，PushPrizeInfo 等初始化静默失败 → 主界面卡 Loading —— 2026-08-24 实证。）
 */
import { MessageHandler, HandlerContext, S2CFrame, buildResponseFrame } from '../types';

export class EchoHandler extends MessageHandler {
  match(): boolean {
    return true;
  }

  handle(ctx: HandlerContext): S2CFrame[] {
    // raw=true：裸请求体直接作 body（不包 dynproto），与真实 echo_body 逐字节一致
    return [buildResponseFrame(ctx, ctx.body, { raw: true })];
  }
}
