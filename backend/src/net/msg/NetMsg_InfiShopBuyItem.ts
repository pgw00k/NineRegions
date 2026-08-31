// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_ShopBuyItem

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiBuyItemRequest,
  InfiBuyItemResponse,
} from 'mc-local-share';

/**
 * Infi_ShopBuyItem
 * REQ = InfiBuyItemRequest
 * RES = InfiBuyItemResponse
 * 注册：reqId=10093、recId=10094
 */
export class NetMsg_InfiShopBuyItem extends MessageBase<InfiBuyItemRequest, InfiBuyItemResponse> {
  /** 请求消息号：INFI_BUY_ITEM_REQ (10093) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_BUY_ITEM_REQ;
  /** 响应消息号：INFI_BUY_ITEM_REP (10094) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_BUY_ITEM_REP;

  override Handle(req: InfiBuyItemRequest): InfiBuyItemResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Infi_ShopBuyItem');
    }
    return resobj
  }
}
