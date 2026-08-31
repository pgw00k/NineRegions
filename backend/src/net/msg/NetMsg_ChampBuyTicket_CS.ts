// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ChampBuyTicket_CS

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ChampBuyTicketRequest,
  ChampBuyTicketResponse,
} from 'mc-local-share';

/**
 * NetMsg_ChampBuyTicket_CS
 * REQ = ChampBuyTicketRequest
 * RES = ChampBuyTicketResponse
 * 注册：reqId=10402、recId=10403
 */
export class NetMsg_ChampBuyTicket_CS extends MessageBase<ChampBuyTicketRequest, ChampBuyTicketResponse> {
  /** 请求消息号：CHAMP_BUYTICKET_REQ (10402) */
  reqId: MESSAGE_ID = MESSAGE_ID.CHAMP_BUYTICKET_REQ;
  /** 响应消息号：CHAMP_BUYTICKET_REP (10403) */
  recId: MESSAGE_ID = MESSAGE_ID.CHAMP_BUYTICKET_REP;

  override Handle(req: ChampBuyTicketRequest): ChampBuyTicketResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_ChampBuyTicket_CS');
    }
    return resobj
  }
}
