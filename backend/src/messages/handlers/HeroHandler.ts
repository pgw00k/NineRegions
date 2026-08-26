/**
 * HeroHandler.ts — 英雄业务消息（MESSAGE_ID.lua 10260-10267 区间）。
 *
 * 覆盖消息（REQ → REP 均为 +1，lua 实证）：
 *  - 10260 CHALLENGE_HERO_REQ → 10261 ChallengeHeroResponse
 *      #1 error #2 hero #3 token #4 roomToken —— 挑战英雄成功后解锁（HeroMgr.SetHero）
 *  - 10262 HERO_GIVE_GIFT_REQ → 10263 HeroGiveGiftResponse
 *      #1 error #2 heroSimple(HeroSimple) #3 dailyFavor(HeroDailyFavor) #4 cost(PrizeInfoSimple)
 *  - 10264 GET_FAVOR_REWARD_REQ → 10265 GetFavorRewardResponse
 *      #1 error #2 hero #3 favorRewardId #4 reward(PrizeInfoSimple) #5 rewardInfo
 *  - 10266 SET_HERO_SKIN_REQ → 10267 SetHeroSkinResponse
 *      #1 error #2 hero #3 skin
 *
 * LockType 枚举（客户端 JYTableEnum.Card.LockType 实证）：0=Lock 1=Challenge 2=Unlocked。
 * 请求体解码与响应构造同 DeckHandler（ProtoTools + AccountDataStore）。
 */
import { MessageHandler, HandlerContext, S2CFrame, buildResponseFrame } from '../types';
import { decodeMessage } from '../ProtoTools';
import { UserStateStore } from '../../state/UserState';

const CHALLENGE_HERO = 10260;
const HERO_GIVE_GIFT = 10262;
const GET_FAVOR_REWARD = 10264;
const SET_HERO_SKIN = 10266;

export class HeroHandler extends MessageHandler {
  match(ctx: HandlerContext): boolean {
    return (
      ctx.msgId === CHALLENGE_HERO ||
      ctx.msgId === HERO_GIVE_GIFT ||
      ctx.msgId === GET_FAVOR_REWARD ||
      ctx.msgId === SET_HERO_SKIN
    );
  }

  handle(ctx: HandlerContext): S2CFrame[] {
    const uid = UserStateStore.extractUserId(ctx.body) ?? ctx.services.users.userId(ctx.connId) ?? null;
    if (!uid) return [];
    try {
      switch (ctx.msgId) {
        case CHALLENGE_HERO:
          return this.challenge(ctx, uid);
        case HERO_GIVE_GIFT:
          return this.giveGift(ctx, uid);
        case GET_FAVOR_REWARD:
          return this.favorReward(ctx, uid);
        case SET_HERO_SKIN:
          return this.setSkin(ctx, uid);
        default:
          return [];
      }
    } catch (e) {
      ctx.services.logger.error('hero', `[${ctx.connId}] ${ctx.msgId} 处理失败: ${(e as Error).message}`);
      return [];
    }
  }

  /** 10260 ChallengeHero：解锁英雄 + 返回战斗 token（后续客户端据此进挑战战斗）。 */
  private challenge(ctx: HandlerContext, uid: string): S2CFrame[] {
    const req = this.decode(ctx, 'ChallengeHeroRequest');
    const hero = Number(req['1'] ?? 0);
    const r = ctx.services.account.challengeHero(uid, hero);
    if (!r) {
      return this.rep(ctx, 'ChallengeHeroResponse', { 1: 0, 2: hero });
    }
    ctx.services.logger.info('hero', `[${ctx.connId}] ChallengeHero hero=${hero} 解锁成功 token=${r.token}`);
    return this.rep(ctx, 'ChallengeHeroResponse', { 1: 0, 2: r.hero, 3: r.token, 4: r.roomToken });
  }

  /** 10262 HeroGiveGift：送礼 → 好感度提升。 */
  private giveGift(ctx: HandlerContext, uid: string): S2CFrame[] {
    const req = this.decode(ctx, 'HeroGiveGiftRequest');
    const hero = Number(req['1'] ?? 0);
    const count = Number(req['3'] ?? 1);
    const r = ctx.services.account.giveGift(uid, hero, count);
    if (!r) return [];
    ctx.services.logger.info('hero', `[${ctx.connId}] HeroGiveGift hero=${hero} x${count} favor=${(r.heroSimple['3'] as number)}`);
    return this.rep(ctx, 'HeroGiveGiftResponse', { 1: 0, 2: r.heroSimple, 3: r.dailyFavor });
  }

  /** 10264 GetFavorReward：领好感奖励。 */
  private favorReward(ctx: HandlerContext, uid: string): S2CFrame[] {
    const req = this.decode(ctx, 'GetFavorRewardRequest');
    const hero = Number(req['1'] ?? 0);
    const rewardId = Number(req['2'] ?? 0);
    const reward = ctx.services.account.getFavorReward(uid, hero, rewardId);
    if (!reward) return [];
    ctx.services.logger.info('hero', `[${ctx.connId}] GetFavorReward hero=${hero} rewardId=${rewardId}`);
    return this.rep(ctx, 'GetFavorRewardResponse', { 1: 0, 2: hero, 3: rewardId, 4: reward });
  }

  /** 10266 SetHeroSkin：换肤。 */
  private setSkin(ctx: HandlerContext, uid: string): S2CFrame[] {
    const req = this.decode(ctx, 'SetHeroSkinRequest');
    const hero = Number(req['1'] ?? 0);
    const skin = Number(req['2'] ?? 0);
    const r = ctx.services.account.setHeroSkin(uid, hero, skin);
    if (!r) return [];
    ctx.services.logger.info('hero', `[${ctx.connId}] SetHeroSkin hero=${hero} skin=${skin}`);
    return this.rep(ctx, 'SetHeroSkinResponse', { 1: 0, 2: r.hero, 3: r.skin });
  }

  // -------------------------------------------------------------------------
  // 工具（与 DeckHandler 相同的约定，保持独立便于各自演进）
  // -------------------------------------------------------------------------

  private decode(ctx: HandlerContext, shortName: string): Record<string, unknown> {
    const s = ctx.services.schema.getByShortName(shortName);
    if (!s) return {};
    return decodeMessage(s, ctx.body, ctx.services.schema);
  }

  private rep(ctx: HandlerContext, shortName: string, payload: Record<string, unknown>): S2CFrame[] {
    const s = ctx.services.schema.getByShortName(shortName);
    if (!s) return [];
    const inner = ctx.services.encoder.encode(s, payload);
    return [buildResponseFrame(ctx, inner)];
  }
}
