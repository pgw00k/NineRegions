// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_CardResolve

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  CardResolveRequest,
  CardResolveResponse,
} from 'mc-local-share';

/**
 * NetMsg_CardResolve
 * REQ = CardResolveRequest
 * RES = CardResolveResponse
 * 注册：reqId=10041,recId=10042
 */
export class NetMsg_CardResolve extends MessageBase<CardResolveRequest, CardResolveResponse> {
  /** 请求消息号：CARD_RESOLVE_REQ (10041) */
  reqId: MESSAGE_ID = MESSAGE_ID.CARD_RESOLVE_REQ;
  /** 响应消息号：CARD_RESOLVE_REP (10042) */
  recId: MESSAGE_ID = MESSAGE_ID.CARD_RESOLVE_REP;

  override HandleSync(req: CardResolveRequest, client?: Client): CardResolveResponse {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_CardResolve');
    }
    return resobj
  }
}
