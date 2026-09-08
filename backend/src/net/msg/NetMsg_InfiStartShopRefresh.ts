// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_StartShopRefresh

import { Client } from '../Client';
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
 * 注册：reqId=10120,recId=10121
 */
export class NetMsg_InfiStartShopRefresh extends MessageBase<InfiRefreshOpenShopReq, InfiRefreshOpenShopRep> {
  /** 请求消息号：INFI_REFRESH_OPENSHOP_REQ (10120) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_REFRESH_OPENSHOP_REQ;
  /** 响应消息号：INFI_REFRESH_OPENSHOP_REP (10121) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_REFRESH_OPENSHOP_REP;

  override HandleSync(req: InfiRefreshOpenShopReq, client?: Client): InfiRefreshOpenShopRep {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: Infi_StartShopRefresh');
    }
    return resobj
  }
}
