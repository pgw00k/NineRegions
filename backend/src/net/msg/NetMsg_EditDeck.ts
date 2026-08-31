// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_EditDeck

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  EditDeckRequest,
  EditDeckResponse,
} from 'mc-local-share';

/**
 * NetMsg_EditDeck
 * REQ = EditDeckRequest
 * RES = EditDeckResponse
 * 注册：reqId=10005、recId=10006
 */
export class NetMsg_EditDeck extends MessageBase<EditDeckRequest, EditDeckResponse> {
  /** 请求消息号：EDIT_DECK_REQ (10005) */
  reqId: MESSAGE_ID = MESSAGE_ID.EDIT_DECK_REQ;
  /** 响应消息号：EDIT_DECK_REP (10006) */
  recId: MESSAGE_ID = MESSAGE_ID.EDIT_DECK_REP;

  override Handle(req: EditDeckRequest): EditDeckResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_EditDeck');
    }
    return resobj
  }
}
