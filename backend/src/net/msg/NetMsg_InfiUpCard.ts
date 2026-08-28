// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Infi_UpCard

import { IHandle } from '../IHandle';
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
export class NetMsg_InfiUpCard implements IHandle<InfiUpCardRequest, InfiUpCardResponse> {
  /** 请求消息号：INFI_UP_CARD_REQ (10090) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.INFI_UP_CARD_REQ;
  /** 响应消息号：INFI_UP_CARD_REP (10091) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.INFI_UP_CARD_REP;

  Handle(req: InfiUpCardRequest): InfiUpCardResponse {
    throw new Error('Handle not implemented: Infi_UpCard');
  }
}
