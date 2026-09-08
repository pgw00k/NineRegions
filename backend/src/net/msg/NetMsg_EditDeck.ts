// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_EditDeck

import { Client } from '../Client';
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
 * 注册：reqId=10005,recId=10006
 */
export class NetMsg_EditDeck extends MessageBase<EditDeckRequest, EditDeckResponse> {
  /** 请求消息号：EDIT_DECK_REQ (10005) */
  reqId: MESSAGE_ID = MESSAGE_ID.EDIT_DECK_REQ;
  /** 响应消息号：EDIT_DECK_REP (10006) */
  recId: MESSAGE_ID = MESSAGE_ID.EDIT_DECK_REP;

  override HandleSync(req: EditDeckRequest, client?: Client, uid?: string, token?: string,exData?:any): EditDeckResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_EditDeck');
    }
    return resobj
  }
}
