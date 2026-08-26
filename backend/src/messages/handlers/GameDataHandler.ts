/**
 * GameDataHandler.ts — 10001 EnterGame → 10002 动态组装玩家数据。
 *
 * 背景：mocks/10002.json 提供 EnterGameResponse 的全部骨架字段（已验证可过
 * 客户端初始化），但 cardLibrary(4)/deckLibrary(5)/heroLibrary(6)/shopInfo(25)
 * 是空结构 —— 导致「账号里既没有 Card 也没有 Hero」。
 *
 * 本处理器：读取 10002.json 骨架 → 用 AccountDataStore 的账号数据覆写
 * 4/5/6/25 → 按同一套 schema 编码下发。其余字段保持骨架原样，零回归风险。
 */
import { MessageHandler, HandlerContext, S2CFrame, buildResponseFrame } from '../types';
import { MockLoader } from '../MockLoader';
import { UserStateStore } from '../../state/UserState';
import { AccountDataStore } from '../../state/AccountDataStore';

/** 进入游戏请求消息号。 */
export const ENTER_GAME_REQ = 10001;
const ENTER_GAME_REP = 10002;

export class GameDataHandler extends MessageHandler {
  private readonly loader: MockLoader;
  private skeleton?: Record<string, unknown>;

  constructor(loader: MockLoader) {
    super();
    this.loader = loader;
  }

  match(ctx: HandlerContext): boolean {
    return ctx.msgId === ENTER_GAME_REQ;
  }

  handle(ctx: HandlerContext): S2CFrame[] {
    try {
      const schema = ctx.services.schema.getByShortName('EnterGameResponse');
      if (!schema) return [];
      const obj = this.skeleton ?? this.loadSkeleton();
      const account = ctx.services.account;

      // 用户 ID：从 C2S body 提取（NetBitStream 前缀内嵌 playerID）
      const userId = UserStateStore.extractUserId(ctx.body) ?? '76561198124119613';

      const merged = { ...obj };
      merged['4'] = account.cardLibraryPayload(userId); // cardLibrary
      merged['5'] = account.deckLibraryPayload(userId); // deckLibrary
      merged['6'] = account.heroLibraryPayload(userId); // heroLibrary
      merged['25'] = account.shopInfoPayload(userId); // shopInfo

      const inner = ctx.services.encoder.encode(schema, merged);
      const cardLib = merged['4'] as { 1: unknown[] };
      const deckLib = merged['5'] as { 1: unknown[] };
      const heroLib = merged['6'] as { 1: unknown[] };
      ctx.services.logger.info(
        'gamedata',
        `[${ctx.connId}] EnterGame 动态组装: cards=${cardLib['1'].length} ` +
          `decks=${deckLib['1'].length} heros=${heroLib['1'].length} user=${userId}`,
      );
      return [buildResponseFrame(ctx, inner)];
    } catch (e) {
      ctx.services.logger.error('gamedata', `10002 动态组装失败: ${(e as Error).message}`);
      return [];
    }
  }

  /** 读取 EnterGameResponse 骨架（占位符已替换，懒加载缓存）。 */
  private loadSkeleton(): Record<string, unknown> {
    const raw = this.loader.loadObject(ENTER_GAME_REP);
    delete raw.$type;
    this.skeleton = raw;
    return raw;
  }
}
