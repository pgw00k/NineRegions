// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_EditDeck

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  EditDeckRequest,
  EditDeckResponse,
} from 'mc-local-share';

/**
 * NetMsg_EditDeck
 * REQ = EditDeckRequest
 * RES = EditDeckResponse
 * 注册：reqId=10005、recId=10006
 */
export class NetMsg_EditDeck implements IHandle<EditDeckRequest, EditDeckResponse> {
  /** 请求消息号：EDIT_DECK_REQ (10005) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.EDIT_DECK_REQ;
  /** 响应消息号：EDIT_DECK_REP (10006) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.EDIT_DECK_REP;

  Handle(req: EditDeckRequest): EditDeckResponse {
    throw new Error('Handle not implemented: NetMsg_EditDeck');
  }
}
