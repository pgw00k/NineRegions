// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ArenaBuyTicket

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ArenaBuyTicketRequest,
  ArenaBuyTicketResponse,
} from 'mc-local-share';

/**
 * NetMsg_ArenaBuyTicket
 * REQ = ArenaBuyTicketRequest
 * RES = ArenaBuyTicketResponse
 * 注册：reqId=10062、recId=10063
 */
export class NetMsg_ArenaBuyTicket extends MessageBase<ArenaBuyTicketRequest, ArenaBuyTicketResponse> {
  /** 请求消息号：ARENA_BUY_TICKET_REQ (10062) */
  reqId: MESSAGE_ID = MESSAGE_ID.ARENA_BUY_TICKET_REQ;
  /** 响应消息号：ARENA_BUY_TICKET_REP (10063) */
  recId: MESSAGE_ID = MESSAGE_ID.ARENA_BUY_TICKET_REP;

  override Handle(req: ArenaBuyTicketRequest): ArenaBuyTicketResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_ArenaBuyTicket');
    }
    return resobj
  }
}
