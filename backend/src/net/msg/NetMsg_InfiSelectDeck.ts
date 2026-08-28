// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Infi_SelectDeck

import { IHandle } from '../IHandle';
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
export class NetMsg_InfiSelectDeck implements IHandle<InfiSelectDeckRequest, InfiSelectDeckResponse> {
  /** 请求消息号：INFI_SELECT_DECK_REQ (10105) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_DECK_REQ;
  /** 响应消息号：INFI_SELECT_DECK_REP (10106) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_DECK_REP;

  Handle(req: InfiSelectDeckRequest): InfiSelectDeckResponse {
    throw new Error('Handle not implemented: Infi_SelectDeck');
  }
}
