// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_StartShopExit

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiOpenShopExitRequest,
  InfiOpenShopExitResponse,
} from 'mc-local-share';

/**
 * Infi_StartShopExit
 * REQ = InfiOpenShopExitRequest
 * RES = InfiOpenShopExitResponse
 * 注册：reqId=10122,recId=10123
 */
export class NetMsg_InfiStartShopExit extends MessageBase<InfiOpenShopExitRequest, InfiOpenShopExitResponse> {
  /** 请求消息号：INFI_OPENSHOP_EXIT_REQ (10122) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_OPENSHOP_EXIT_REQ;
  /** 响应消息号：INFI_OPENSHOP_EXIT_REP (10123) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_OPENSHOP_EXIT_REP;

  override HandleSync(req: InfiOpenShopExitRequest, client?: Client, uid?: string, token?: string,exData?:any): InfiOpenShopExitResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: Infi_StartShopExit');
    }
    return resobj
  }
}
