// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_Buy_PVE

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  PveBuyRequest,
  PveBuyResponse,
} from 'mc-local-share';

/**
 * NetMsg_Buy_PVE
 * REQ = PveBuyRequest
 * RES = PveBuyResponse
 * 注册：reqId=10390,recId=10391
 */
export class NetMsg_Buy_PVE extends MessageBase<PveBuyRequest, PveBuyResponse> {
  /** 请求消息号：PVE_BUY_REQ (10390) */
  reqId: MESSAGE_ID = MESSAGE_ID.PVE_BUY_REQ;
  /** 响应消息号：PVE_BUY_REP (10391) */
  recId: MESSAGE_ID = MESSAGE_ID.PVE_BUY_REP;

  override HandleSync(req: PveBuyRequest, client?: Client, uid?: string, token?: string,exData?:any): PveBuyResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_Buy_PVE');
    }
    return resobj
  }
}
