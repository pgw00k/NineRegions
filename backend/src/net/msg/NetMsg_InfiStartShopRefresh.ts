// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_StartShopRefresh

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiRefreshOpenShopReq,
  InfiRefreshOpenShopRep,
} from 'mc-local-share';

/**
 * Infi_StartShopRefresh
 * REQ = InfiRefreshOpenShopReq
 * RES = InfiRefreshOpenShopRep
 * 注册：reqId=10120、recId=10121
 */
export class NetMsg_InfiStartShopRefresh extends MessageBase<InfiRefreshOpenShopReq, InfiRefreshOpenShopRep> {
  /** 请求消息号：INFI_REFRESH_OPENSHOP_REQ (10120) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_REFRESH_OPENSHOP_REQ;
  /** 响应消息号：INFI_REFRESH_OPENSHOP_REP (10121) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_REFRESH_OPENSHOP_REP;

  override Handle(req: InfiRefreshOpenShopReq): InfiRefreshOpenShopRep {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Infi_StartShopRefresh');
    }
    return resobj
  }
}
