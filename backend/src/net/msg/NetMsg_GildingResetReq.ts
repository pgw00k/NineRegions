// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_GildingResetReq

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GildingResetRequest,
} from 'mc-local-share';

/**
 * NetMsg_GildingResetReq
 * REQ = GildingResetRequest
 * RES = {}
 * 注册：reqId=10432,recId=0
 */
export class NetMsg_GildingResetReq extends MessageBase<GildingResetRequest, {}> {
  /** 请求消息号：GILDING_RESET_REQ (10432) */
  reqId: MESSAGE_ID = MESSAGE_ID.GILDING_RESET_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override HandleSync(req: GildingResetRequest, client?: Client): {} {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_GildingResetReq');
    }
    return resobj
  }
}
