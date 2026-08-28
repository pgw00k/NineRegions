// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_CS_CancelMatch

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  CancelMatchRequest,
  CancelMatchResponse,
} from 'mc-local-share';

/**
 * NetMsg_CS_CancelMatch
 * REQ = CancelMatchRequest
 * RES = CancelMatchResponse
 * 注册：reqId=10013、recId=10014
 */
export class NetMsg_CancelMatch_CS implements IHandle<CancelMatchRequest, CancelMatchResponse> {
  /** 请求消息号：CANCEL_MATCH_REQ (10013) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.CANCEL_MATCH_REQ;
  /** 响应消息号：CANCEL_MATCH_REP (10014) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.CANCEL_MATCH_REP;

  Handle(req: CancelMatchRequest): CancelMatchResponse {
    throw new Error('Handle not implemented: NetMsg_CS_CancelMatch');
  }
}
