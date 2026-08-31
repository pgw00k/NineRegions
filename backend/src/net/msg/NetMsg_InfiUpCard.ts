// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_UpCard

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiUpCardRequest,
  InfiUpCardResponse,
} from 'mc-local-share';

/**
 * Infi_UpCard
 * REQ = InfiUpCardRequest
 * RES = InfiUpCardResponse
 * 注册：reqId=10090、recId=10091
 */
export class NetMsg_InfiUpCard extends MessageBase<InfiUpCardRequest, InfiUpCardResponse> {
  /** 请求消息号：INFI_UP_CARD_REQ (10090) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_UP_CARD_REQ;
  /** 响应消息号：INFI_UP_CARD_REP (10091) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_UP_CARD_REP;

  override Handle(req: InfiUpCardRequest): InfiUpCardResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Infi_UpCard');
    }
    return resobj
  }
}
