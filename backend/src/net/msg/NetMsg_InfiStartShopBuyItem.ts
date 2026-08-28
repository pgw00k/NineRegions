// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Infi_StartShopBuyItem

import { IHandle } from '../IHandle';
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
export class NetMsg_InfiStartShopBuyItem implements IHandle<InfiOpenShopBuyRequest, InfiOpenShopBuyResponse> {
  /** 请求消息号：INFI_OPEN_SHOP_BUY_REQ (10118) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.INFI_OPEN_SHOP_BUY_REQ;
  /** 响应消息号：INFI_OEPN_SHOP_BUY_REP (10119) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.INFI_OEPN_SHOP_BUY_REP;

  Handle(req: InfiOpenShopBuyRequest): InfiOpenShopBuyResponse {
    throw new Error('Handle not implemented: Infi_StartShopBuyItem');
  }
}
