// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ArenaSelCard

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  ArenaSelectCardsRequest,
  ArenaSelectCardsResponse,
} from 'mc-local-share';

/**
 * NetMsg_ArenaSelCard
 * REQ = ArenaSelectCardsRequest
 * RES = ArenaSelectCardsResponse
 * 注册：reqId=10066、recId=10067
 */
export class NetMsg_ArenaSelCard implements IHandle<ArenaSelectCardsRequest, ArenaSelectCardsResponse> {
  /** 请求消息号：ARENA_SELECT_CARDS_REQ (10066) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.ARENA_SELECT_CARDS_REQ;
  /** 响应消息号：ARENA_SELECT_CARDS_REP (10067) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.ARENA_SELECT_CARDS_REP;

  Handle(req: ArenaSelectCardsRequest): ArenaSelectCardsResponse {
    throw new Error('Handle not implemented: NetMsg_ArenaSelCard');
  }
}
