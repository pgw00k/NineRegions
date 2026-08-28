// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: ShopBuy

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  ShopBuyRequest,
  ShopBuyResponse,
} from 'mc-local-share';

/**
 * ShopBuy
 * REQ = ShopBuyRequest
 * RES = ShopBuyResponse
 * 注册：reqId=10212、recId=10213
 */
export class NetMsg_ShopBuy implements IHandle<ShopBuyRequest, ShopBuyResponse> {
  /** 请求消息号：SHOP_BUY_REQ (10212) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.SHOP_BUY_REQ;
  /** 响应消息号：SHOP_BUY_REP (10213) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.SHOP_BUY_REP;

  Handle(req: ShopBuyRequest): ShopBuyResponse {
    throw new Error('Handle not implemented: ShopBuy');
  }
}
