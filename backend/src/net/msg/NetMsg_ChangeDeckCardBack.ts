// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ChangeDeckCardBack

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  ChangeDeckCardBackRequest,
  ChangeDeckCardBackResponse,
} from 'mc-local-share';

/**
 * NetMsg_ChangeDeckCardBack
 * REQ = ChangeDeckCardBackRequest
 * RES = ChangeDeckCardBackResponse
 * 注册：reqId=10133、recId=10134
 */
export class NetMsg_ChangeDeckCardBack implements IHandle<ChangeDeckCardBackRequest, ChangeDeckCardBackResponse> {
  /** 请求消息号：CHANGE_DECK_CARDBACK_REQ (10133) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.CHANGE_DECK_CARDBACK_REQ;
  /** 响应消息号：CHANGE_DECK_CARDBACK_REP (10134) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.CHANGE_DECK_CARDBACK_REP;

  Handle(req: ChangeDeckCardBackRequest): ChangeDeckCardBackResponse {
    throw new Error('Handle not implemented: NetMsg_ChangeDeckCardBack');
  }
}
