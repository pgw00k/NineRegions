// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ArenaSelCard

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ArenaSelectCardsRequest,
  ArenaSelectCardsResponse,
} from 'mc-local-share';

/**
 * NetMsg_ArenaSelCard
 * REQ = ArenaSelectCardsRequest
 * RES = ArenaSelectCardsResponse
 * 注册：reqId=10066,recId=10067
 */
export class NetMsg_ArenaSelCard extends MessageBase<ArenaSelectCardsRequest, ArenaSelectCardsResponse> {
  /** 请求消息号：ARENA_SELECT_CARDS_REQ (10066) */
  reqId: MESSAGE_ID = MESSAGE_ID.ARENA_SELECT_CARDS_REQ;
  /** 响应消息号：ARENA_SELECT_CARDS_REP (10067) */
  recId: MESSAGE_ID = MESSAGE_ID.ARENA_SELECT_CARDS_REP;

  override HandleSync(req: ArenaSelectCardsRequest, client?: Client): ArenaSelectCardsResponse {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_ArenaSelCard');
    }
    return resobj
  }
}
