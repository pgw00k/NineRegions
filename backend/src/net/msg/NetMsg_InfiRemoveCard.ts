// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_RemoveCard

import { Client } from '../Client';
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
 * 注册：reqId=10092,recId=10092
 */
export class NetMsg_InfiRemoveCard extends MessageBase<InfiDelCardRequest, InfiDelCardResponse> {
  /** 请求消息号：INFI_DEL_CARD_REQ (10092) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_DEL_CARD_REQ;
  /** 响应消息号：INFI_DEL_CARD_REP (10092) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_DEL_CARD_REP;

  override HandleSync(req: InfiDelCardRequest, client?: Client): InfiDelCardResponse {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: Infi_RemoveCard');
    }
    return resobj
  }
}
