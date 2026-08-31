// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ChangeDeckCardBack

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
 * 注册：reqId=10133、recId=10134
 */
export class NetMsg_ChangeDeckCardBack extends MessageBase<ChangeDeckCardBackRequest, ChangeDeckCardBackResponse> {
  /** 请求消息号：CHANGE_DECK_CARDBACK_REQ (10133) */
  reqId: MESSAGE_ID = MESSAGE_ID.CHANGE_DECK_CARDBACK_REQ;
  /** 响应消息号：CHANGE_DECK_CARDBACK_REP (10134) */
  recId: MESSAGE_ID = MESSAGE_ID.CHANGE_DECK_CARDBACK_REP;

  override Handle(req: ChangeDeckCardBackRequest): ChangeDeckCardBackResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_ChangeDeckCardBack');
    }
    return resobj
  }
}
