// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ChangeDeckCardBack

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ChangeDeckCardBackRequest,
  ChangeDeckCardBackResponse,
} from 'mc-local-share';

/**
 * NetMsg_ChangeDeckCardBack
 * REQ = ChangeDeckCardBackRequest
 * RES = ChangeDeckCardBackResponse
 * 注册：reqId=10133,recId=10134
 */
export class NetMsg_ChangeDeckCardBack extends MessageBase<ChangeDeckCardBackRequest, ChangeDeckCardBackResponse> {
  /** 请求消息号：CHANGE_DECK_CARDBACK_REQ (10133) */
  reqId: MESSAGE_ID = MESSAGE_ID.CHANGE_DECK_CARDBACK_REQ;
  /** 响应消息号：CHANGE_DECK_CARDBACK_REP (10134) */
  recId: MESSAGE_ID = MESSAGE_ID.CHANGE_DECK_CARDBACK_REP;

  override HandleSync(req: ChangeDeckCardBackRequest, client?: Client, uid?: string, token?: string,exData?:any): ChangeDeckCardBackResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_ChangeDeckCardBack');
    }
    return resobj
  }
}
