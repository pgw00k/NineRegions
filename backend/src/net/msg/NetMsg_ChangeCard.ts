// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: ChangeCard

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ChangeCardRequest,
  ChangeCardResponse,
} from 'mc-local-share';

/**
 * ChangeCard
 * REQ = ChangeCardRequest
 * RES = ChangeCardResponse
 * 注册：reqId=25003,recId=25004
 */
export class NetMsg_ChangeCard extends MessageBase<ChangeCardRequest, ChangeCardResponse> {
  /** 请求消息号：CHANGE_CARD_REQ (25003) */
  reqId: MESSAGE_ID = MESSAGE_ID.CHANGE_CARD_REQ;
  /** 响应消息号：CHANGE_CARD_REP (25004) */
  recId: MESSAGE_ID = MESSAGE_ID.CHANGE_CARD_REP;

  override HandleSync(req: ChangeCardRequest, client?: Client, uid?: string, token?: string,exData?:any): ChangeCardResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: ChangeCard');
    }
    return resobj
  }
}
