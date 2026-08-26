/**
 * ShopHandler.ts — 商店业务消息（MESSAGE_ID.lua 10210-10213 区间）。
 *
 * 覆盖消息（REQ → REP 均为 +1，lua 实证）：
 *  - 10210 GET_SHOP_INFO_REQ → 10211 GetShopInfoResponse
 *      #1 type #2 info(ShopSimpleInfo[]) → ShopDataMgr.SetShopInfo(type, info)
 *  - 10212 SHOP_BUY_REQ → 10213 ShopBuyResponse
 *      #1 error #2 type #3 buyID #4 buyCount #5 items(ItemInfoSimple[])
 *      #6 change(PrizeInfoSimple) #7 shopInfo(ShopSimpleInfo[]) → ShopDataMgr.UpdateShopBuyByNet
 *
 * ShopSimpleInfo: #1 id #2 buyCount #3 totalBuyCount #4 type #5 floorCounts
 *  - 服务端只记录「已购次数」（buyCount/totalBuyCount）；货物清单与价格在客户端
 *    ShopCardBag 等表（服务端无需下发，mocks 与 4010 服务一致）。
 *  - ShopType 枚举（客户端实证）：CardBag=1（卡包抽卡，EnterGameResponse.shopInfo
 *    即此类型）、PreBag=2、Hero=3。
 *
 * 客户端 GetShopInfo 触发点：进商店 UI（UIPanelShopMain.SendGetShopInfo），type 即
 * 当前页签；服务端返回该类型的已购记录（无则空数组，客户端按表渲染货物）。
 */
import { MessageHandler, HandlerContext, S2CFrame, buildResponseFrame } from '../types';
import { decodeMessage } from '../ProtoTools';
import { UserStateStore } from '../../state/UserState';

const GET_SHOP_INFO = 10210;
const SHOP_BUY = 10212;

export class ShopHandler extends MessageHandler {
  match(ctx: HandlerContext): boolean {
    return ctx.msgId === GET_SHOP_INFO || ctx.msgId === SHOP_BUY;
  }

  handle(ctx: HandlerContext): S2CFrame[] {
    const uid = UserStateStore.extractUserId(ctx.body) ?? ctx.services.users.userId(ctx.connId) ?? null;
    if (!uid) return [];
    try {
      if (ctx.msgId === GET_SHOP_INFO) return this.getInfo(ctx, uid);
      return this.buy(ctx, uid);
    } catch (e) {
      ctx.services.logger.error('shop', `[${ctx.connId}] ${ctx.msgId} 处理失败: ${(e as Error).message}`);
      return [];
    }
  }

  /** 10210 GetShopInfo：返回指定商店类型的已购记录。 */
  private getInfo(ctx: HandlerContext, uid: string): S2CFrame[] {
    const req = this.decode(ctx, 'GetShopInfoRequest');
    const type = Number(req['1'] ?? 0);
    const info = ctx.services.account.getShopInfo(uid, type);
    ctx.services.logger.info('shop', `[${ctx.connId}] GetShopInfo type=${type} 记录${info.length}条`);
    return this.rep(ctx, 'GetShopInfoResponse', { 1: type, 2: info });
  }

  /** 10212 ShopBuy：购买 → 扣货币 + 记录次数。 */
  private buy(ctx: HandlerContext, uid: string): S2CFrame[] {
    const req = this.decode(ctx, 'ShopBuyRequest');
    const type = Number(req['1'] ?? 0);
    const buyId = Number(req['2'] ?? 0);
    const count = Number(req['3'] ?? 1);
    const r = ctx.services.account.buy(uid, type, buyId, count);
    if (!r) return [];
    ctx.services.logger.info('shop', `[${ctx.connId}] ShopBuy type=${type} buyId=${buyId} x${count}`);
    return this.rep(ctx, 'ShopBuyResponse', {
      1: 0,
      2: type,
      3: buyId,
      4: count,
      5: r.items,
      7: r.shopInfo,
    });
  }

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
