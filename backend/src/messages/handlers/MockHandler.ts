/**
 * MockHandler.ts — 数据驱动的业务消息模拟。
 *
 * 若 mocks/<repMsgId>.json 存在，则加载并按 schema 编码为应答。覆盖绝大多数
 * REQ/REP 配对（登录 / 进游戏 / 心跳 / 重连 / 5 个业务消息 / 海量后续消息），
 * 真正「单文件模拟单消息」。编码失败则降级为不回应（避免发畸形包）。
 */
import { MessageHandler, HandlerContext, S2CFrame, buildResponseFrame } from '../types';
import { MockLoader } from '../MockLoader';

export class MockHandler extends MessageHandler {
  constructor(private readonly loader: MockLoader) {
    super();
  }

  match(ctx: HandlerContext): boolean {
    return this.loader.exists(ctx.repMsgId);
  }

  handle(ctx: HandlerContext): S2CFrame[] {
    try {
      const inner = this.loader.load(ctx.repMsgId);
      return [buildResponseFrame(ctx, inner)];
    } catch (e) {
      ctx.services.logger.error(
        'mock',
        `编码 mock ${ctx.repMsgId} 失败: ${(e as Error).message}`,
      );
      return [];
    }
  }
}
