// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_SelectDeck

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiSelectDeckRequest,
  InfiSelectDeckResponse,
} from 'mc-local-share';

/**
 * Infi_SelectDeck
 * REQ = InfiSelectDeckRequest
 * RES = InfiSelectDeckResponse
 * 注册：reqId=10105、recId=10106
 */
export class NetMsg_InfiSelectDeck extends MessageBase<InfiSelectDeckRequest, InfiSelectDeckResponse> {
  /** 请求消息号：INFI_SELECT_DECK_REQ (10105) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_DECK_REQ;
  /** 响应消息号：INFI_SELECT_DECK_REP (10106) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_DECK_REP;

  override Handle(req: InfiSelectDeckRequest): InfiSelectDeckResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Infi_SelectDeck');
    }
    return resobj
  }
}
