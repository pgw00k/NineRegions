// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_CardResolve

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  CardResolveRequest,
  CardResolveResponse,
} from 'mc-local-share';

/**
 * NetMsg_CardResolve
 * REQ = CardResolveRequest
 * RES = CardResolveResponse
 * 注册：reqId=10041、recId=10042
 */
export class NetMsg_CardResolve implements IHandle<CardResolveRequest, CardResolveResponse> {
  /** 请求消息号：CARD_RESOLVE_REQ (10041) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.CARD_RESOLVE_REQ;
  /** 响应消息号：CARD_RESOLVE_REP (10042) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.CARD_RESOLVE_REP;

  Handle(req: CardResolveRequest): CardResolveResponse {
    throw new Error('Handle not implemented: NetMsg_CardResolve');
  }
}
