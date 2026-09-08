// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_GildingReq

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GildingResponse,
} from 'mc-local-share';

/**
 * NetMsg_GildingReq
 * REQ = {}
 * RES = GildingResponse
 * 注册：reqId=0,recId=10431
 */
export class NetMsg_GildingRep extends MessageBase<{}, GildingResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：GILDING_REP (10431) */
  recId: MESSAGE_ID = MESSAGE_ID.GILDING_REP;

  override HandleSync(req: {}, client?: Client, uid?: string, token?: string,exData?:any): GildingResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_GildingReq');
    }
    return resobj
  }
}
