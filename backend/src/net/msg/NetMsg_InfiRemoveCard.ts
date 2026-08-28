// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Infi_RemoveCard

import { IHandle } from '../IHandle';
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
export class NetMsg_InfiRemoveCard implements IHandle<InfiDelCardRequest, InfiDelCardResponse> {
  /** 请求消息号：INFI_DEL_CARD_REQ (10092) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.INFI_DEL_CARD_REQ;
  /** 响应消息号：INFI_DEL_CARD_REP (10092) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.INFI_DEL_CARD_REP;

  Handle(req: InfiDelCardRequest): InfiDelCardResponse {
    throw new Error('Handle not implemented: Infi_RemoveCard');
  }
}
