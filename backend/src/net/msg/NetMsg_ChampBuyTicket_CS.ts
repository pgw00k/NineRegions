// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ChampBuyTicket_CS

import { Client } from '../Client';
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
 * 注册：reqId=10402,recId=10403
 */
export class NetMsg_ChampBuyTicket_CS extends MessageBase<ChampBuyTicketRequest, ChampBuyTicketResponse> {
  /** 请求消息号：CHAMP_BUYTICKET_REQ (10402) */
  reqId: MESSAGE_ID = MESSAGE_ID.CHAMP_BUYTICKET_REQ;
  /** 响应消息号：CHAMP_BUYTICKET_REP (10403) */
  recId: MESSAGE_ID = MESSAGE_ID.CHAMP_BUYTICKET_REP;

  override HandleSync(req: ChampBuyTicketRequest, client?: Client): ChampBuyTicketResponse {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_ChampBuyTicket_CS');
    }
    return resobj
  }
}
