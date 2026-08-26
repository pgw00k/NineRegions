/**
 * DeckHandler.ts — 牌组/卡牌业务消息（MESSAGE_ID.lua 10005-10044 区间）。
 *
 * 覆盖消息（REQ → REP 均为 +1，lua 实证）：
 *  - 10005 EDIT_DECK_REQ → 10006 EditDeckResponse
 *      #1 error #2 deck(DeckSimple)  → DeckMgr.SyncFromNet(deck) + Fire DeckEditDeckSuccess
 *  - 10007 DELETE_DECK_REQ → 10008 DeleteDeckResponse
 *      #1 error #2 did              → DeckMgr.RemoveDeck(did)
 *  - 10039 CHANGE_DECKNAME_REQ → 10040 ChangeDeckNameResponse
 *      #1 error #2 did #3 name
 *  - 10041 CARD_RESOLVE_REQ → 10042 CardResolveResponse
 *      #1 error #2 request(CardSimple[]) #3 success(CardSimple[]) #4 getInfo(PrizeInfoSimple)
 *      #5 costInfo #6 deckInfo(DeckLibrarySimple)  → AccountDataMgr.SetPrizeInfo
 *  - 10043 CARD_COMPOUND_REQ → 10044 CardCompoundResponse
 *      #1 error #2 request #3 success #4 getInfo #5 costInfo
 *
 * 请求体为「NetBitStream 前缀 + 内嵌 protobuf」，用 ProtoTools.decodeMessage 按
 * schema 解码出字段号 keyed 对象；响应全部落到 AccountDataStore，状态保持。
 */
import { MessageHandler, HandlerContext, S2CFrame, buildResponseFrame } from '../types';
import { decodeMessage } from '../ProtoTools';
import { UserStateStore } from '../../state/UserState';
import { AccountDataStore } from '../../state/AccountDataStore';

const EDIT_DECK = 10005;
const DELETE_DECK = 10007;
const CHANGE_DECKNAME = 10039;
const CARD_RESOLVE = 10041;
const CARD_COMPOUND = 10043;

export class DeckHandler extends MessageHandler {
  match(ctx: HandlerContext): boolean {
    return (
      ctx.msgId === EDIT_DECK ||
      ctx.msgId === DELETE_DECK ||
      ctx.msgId === CHANGE_DECKNAME ||
      ctx.msgId === CARD_RESOLVE ||
      ctx.msgId === CARD_COMPOUND
    );
  }

  handle(ctx: HandlerContext): S2CFrame[] {
    const uid = this.userId(ctx);
    if (!uid) return [];
    try {
      switch (ctx.msgId) {
        case EDIT_DECK:
          return this.editDeck(ctx, uid);
        case DELETE_DECK:
          return this.deleteDeck(ctx, uid);
        case CHANGE_DECKNAME:
          return this.changeDeckName(ctx, uid);
        case CARD_RESOLVE:
          return this.resolve(ctx, uid);
        case CARD_COMPOUND:
          return this.compound(ctx, uid);
        default:
          return [];
      }
    } catch (e) {
      ctx.services.logger.error('deck', `[${ctx.connId}] ${ctx.msgId} 处理失败: ${(e as Error).message}`);
      return [];
    }
  }

  private userId(ctx: HandlerContext): string | null {
    return UserStateStore.extractUserId(ctx.body) ?? ctx.services.users.userId(ctx.connId) ?? null;
  }

  // -------------------------------------------------------------------------
  // 10005 EditDeck
  // -------------------------------------------------------------------------

  private editDeck(ctx: HandlerContext, uid: string): S2CFrame[] {
    const req = this.decode(ctx, 'EditDeckRequest');
    const deck = req['1'] as Record<string, unknown> | undefined;
    const payload = ctx.services.account.editDeck(uid, deck ?? {});
    if (!payload) return [];
    ctx.services.logger.info(
      'deck',
      `[${ctx.connId}] EditDeck did=${payload['1']} hero=${payload['3']} cards=${(payload['6'] as unknown[]).length}张`,
    );
    return this.rep(ctx, 'EditDeckResponse', { 1: 0, 2: payload });
  }

  // -------------------------------------------------------------------------
  // 10007 DeleteDeck
  // -------------------------------------------------------------------------

  private deleteDeck(ctx: HandlerContext, uid: string): S2CFrame[] {
    const req = this.decode(ctx, 'DeleteDeckRequest');
    const did = Number(req['1'] ?? 0);
    const removed = ctx.services.account.deleteDeck(uid, did);
    if (removed === null) {
      return this.rep(ctx, 'DeleteDeckResponse', { 1: 0, 2: did }); // 容错：不存在也回成功
    }
    ctx.services.logger.info('deck', `[${ctx.connId}] DeleteDeck did=${did}`);
    return this.rep(ctx, 'DeleteDeckResponse', { 1: 0, 2: did });
  }

  // -------------------------------------------------------------------------
  // 10039 ChangeDeckName
  // -------------------------------------------------------------------------

  private changeDeckName(ctx: HandlerContext, uid: string): S2CFrame[] {
    const req = this.decode(ctx, 'ChangeDeckNameRequest');
    const did = Number(req['1'] ?? 0);
    const name = String(req['2'] ?? '');
    const r = ctx.services.account.changeDeckName(uid, did, name);
    if (!r) return [];
    ctx.services.logger.info('deck', `[${ctx.connId}] ChangeDeckName did=${did} name="${r.name}"`);
    return this.rep(ctx, 'ChangeDeckNameResponse', { 1: 0, 2: r.did, 3: r.name });
  }

  // -------------------------------------------------------------------------
  // 10041 CardResolve（分解）
  // -------------------------------------------------------------------------

  private resolve(ctx: HandlerContext, uid: string): S2CFrame[] {
    const req = this.decode(ctx, 'CardResolveRequest');
    const cards = this.cardList(req['1']);
    if (cards.length === 0) return [];
    const r = ctx.services.account.resolveCards(uid, cards);
    if (!r) return [];
    ctx.services.logger.info('deck', `[${ctx.connId}] CardResolve ${r.success.length}组 分解成功`);
    return this.rep(ctx, 'CardResolveResponse', {
      1: 0,
      2: cards.map((c) => ({ 1: c.cid, 2: c.count })),
      3: r.success.map((c) => ({ 1: c.cid, 2: c.count })),
      4: r.getInfo,
      6: r.deckInfo,
    });
  }

  // -------------------------------------------------------------------------
  // 10043 CardCompound（合成）
  // -------------------------------------------------------------------------

  private compound(ctx: HandlerContext, uid: string): S2CFrame[] {
    const req = this.decode(ctx, 'CardCompoundRequest');
    const cards = this.cardList(req['1']);
    if (cards.length === 0) return [];
    const r = ctx.services.account.compoundCards(uid, cards);
    if (!r) return [];
    ctx.services.logger.info('deck', `[${ctx.connId}] CardCompound ${r.success.length}组 合成成功`);
    return this.rep(ctx, 'CardCompoundResponse', {
      1: 0,
      2: cards.map((c) => ({ 1: c.cid, 2: c.count })),
      3: r.success.map((c) => ({ 1: c.cid, 2: c.count })),
      5: r.costInfo,
    });
  }

  // -------------------------------------------------------------------------
  // 工具
  // -------------------------------------------------------------------------

  private decode(ctx: HandlerContext, shortName: string): Record<string, unknown> {
    const s = ctx.services.schema.getByShortName(shortName);
    if (!s) return {};
    return decodeMessage(s, ctx.body, ctx.services.schema);
  }

  private cardList(v: unknown): { cid: number; count: number }[] {
    if (!Array.isArray(v)) return [];
    return v
      .filter((x): x is Record<string, unknown> => typeof x === 'object' && x !== null)
      .map((x) => ({ cid: Number(x['1'] ?? 0), count: Number(x['2'] ?? 1) }))
      .filter((x) => x.cid > 0);
  }

  private rep(ctx: HandlerContext, shortName: string, payload: Record<string, unknown>): S2CFrame[] {
    const s = ctx.services.schema.getByShortName(shortName);
    if (!s) return [];
    const inner = ctx.services.encoder.encode(s, payload);
    return [buildResponseFrame(ctx, inner)];
  }
}
