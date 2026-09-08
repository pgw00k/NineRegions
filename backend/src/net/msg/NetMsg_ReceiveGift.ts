// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: ReceiveGift

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ReceiveGiftRequest,
  ReceiveGiftResponse,
} from 'mc-local-share';

/**
 * ReceiveGift
 * REQ = ReceiveGiftRequest
 * RES = ReceiveGiftResponse
 * 注册：reqId=10024,recId=10025
 */
export class NetMsg_ReceiveGift extends MessageBase<ReceiveGiftRequest, ReceiveGiftResponse> {
  /** 请求消息号：RECEIVE_GIFT_REQ (10024) */
  reqId: MESSAGE_ID = MESSAGE_ID.RECEIVE_GIFT_REQ;
  /** 响应消息号：RECEIVE_GIFT_REP (10025) */
  recId: MESSAGE_ID = MESSAGE_ID.RECEIVE_GIFT_REP;

  override HandleSync(req: ReceiveGiftRequest, client?: Client, uid?: string, token?: string,exData?:any): ReceiveGiftResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: ReceiveGift');
    }
    return resobj
  }
}
