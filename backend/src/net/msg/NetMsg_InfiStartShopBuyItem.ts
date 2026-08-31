// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_StartShopBuyItem

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiOpenShopBuyRequest,
  InfiOpenShopBuyResponse,
} from 'mc-local-share';

/**
 * Infi_StartShopBuyItem
 * REQ = InfiOpenShopBuyRequest
 * RES = InfiOpenShopBuyResponse
 * 注册：reqId=10118、recId=10119
 */
export class NetMsg_InfiStartShopBuyItem extends MessageBase<InfiOpenShopBuyRequest, InfiOpenShopBuyResponse> {
  /** 请求消息号：INFI_OPEN_SHOP_BUY_REQ (10118) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_OPEN_SHOP_BUY_REQ;
  /** 响应消息号：INFI_OEPN_SHOP_BUY_REP (10119) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_OEPN_SHOP_BUY_REP;

  override Handle(req: InfiOpenShopBuyRequest): InfiOpenShopBuyResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Infi_StartShopBuyItem');
    }
    return resobj
  }
}
