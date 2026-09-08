// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_CardCompound

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  CardCompoundRequest,
  CardCompoundResponse,
} from 'mc-local-share';

/**
 * NetMsg_CardCompound
 * REQ = CardCompoundRequest
 * RES = CardCompoundResponse
 * 注册：reqId=10043,recId=10044
 */
export class NetMsg_CardCompound extends MessageBase<CardCompoundRequest, CardCompoundResponse> {
  /** 请求消息号：CARD_COMPOUND_REQ (10043) */
  reqId: MESSAGE_ID = MESSAGE_ID.CARD_COMPOUND_REQ;
  /** 响应消息号：CARD_COMPOUND_REP (10044) */
  recId: MESSAGE_ID = MESSAGE_ID.CARD_COMPOUND_REP;

  override HandleSync(req: CardCompoundRequest, client?: Client): CardCompoundResponse {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_CardCompound');
    }
    return resobj
  }
}
