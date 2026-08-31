// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_RemoveCard

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiDelCardRequest,
  InfiDelCardResponse,
} from 'mc-local-share';

/**
 * Infi_RemoveCard
 * REQ = InfiDelCardRequest
 * RES = InfiDelCardResponse
 * 注册：reqId=10092、recId=10092
 */
export class NetMsg_InfiRemoveCard extends MessageBase<InfiDelCardRequest, InfiDelCardResponse> {
  /** 请求消息号：INFI_DEL_CARD_REQ (10092) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_DEL_CARD_REQ;
  /** 响应消息号：INFI_DEL_CARD_REP (10092) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_DEL_CARD_REP;

  override Handle(req: InfiDelCardRequest): InfiDelCardResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Infi_RemoveCard');
    }
    return resobj
  }
}
