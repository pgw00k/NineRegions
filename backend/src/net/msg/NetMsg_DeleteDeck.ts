// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_DeleteDeck

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  DeleteDeckRequest,
  DeleteDeckResponse,
} from 'mc-local-share';

/**
 * NetMsg_DeleteDeck
 * REQ = DeleteDeckRequest
 * RES = DeleteDeckResponse
 * 注册：reqId=10007、recId=10008
 */
export class NetMsg_DeleteDeck implements IHandle<DeleteDeckRequest, DeleteDeckResponse> {
  /** 请求消息号：DELETE_DECK_REQ (10007) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.DELETE_DECK_REQ;
  /** 响应消息号：DELETE_DECK_REP (10008) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.DELETE_DECK_REP;

  Handle(req: DeleteDeckRequest): DeleteDeckResponse {
    throw new Error('Handle not implemented: NetMsg_DeleteDeck');
  }
}
