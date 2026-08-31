// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_DeleteDeck

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  DeleteDeckRequest,
  DeleteDeckResponse,
} from 'mc-local-share';

/**
 * NetMsg_DeleteDeck
 * REQ = DeleteDeckRequest
 * RES = DeleteDeckResponse
 * 注册：reqId=10007、recId=10008
 */
export class NetMsg_DeleteDeck extends MessageBase<DeleteDeckRequest, DeleteDeckResponse> {
  /** 请求消息号：DELETE_DECK_REQ (10007) */
  reqId: MESSAGE_ID = MESSAGE_ID.DELETE_DECK_REQ;
  /** 响应消息号：DELETE_DECK_REP (10008) */
  recId: MESSAGE_ID = MESSAGE_ID.DELETE_DECK_REP;

  override Handle(req: DeleteDeckRequest): DeleteDeckResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_DeleteDeck');
    }
    return resobj
  }
}
