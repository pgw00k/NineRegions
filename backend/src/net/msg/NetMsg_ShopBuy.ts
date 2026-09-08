// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: ShopBuy

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ShopBuyRequest,
  ShopBuyResponse,
} from 'mc-local-share';

/**
 * ShopBuy
 * REQ = ShopBuyRequest
 * RES = ShopBuyResponse
 * 注册：reqId=10212,recId=10213
 */
export class NetMsg_ShopBuy extends MessageBase<ShopBuyRequest, ShopBuyResponse> {
  /** 请求消息号：SHOP_BUY_REQ (10212) */
  reqId: MESSAGE_ID = MESSAGE_ID.SHOP_BUY_REQ;
  /** 响应消息号：SHOP_BUY_REP (10213) */
  recId: MESSAGE_ID = MESSAGE_ID.SHOP_BUY_REP;

  override HandleSync(req: ShopBuyRequest, client?: Client, uid?: string, token?: string,exData?:any): ShopBuyResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: ShopBuy');
    }
    return resobj
  }
}
