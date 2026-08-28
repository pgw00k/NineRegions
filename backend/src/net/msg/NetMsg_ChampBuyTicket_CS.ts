// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ChampBuyTicket_CS

import { IHandle } from '../IHandle';
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
export class NetMsg_ChampBuyTicket_CS implements IHandle<ChampBuyTicketRequest, ChampBuyTicketResponse> {
  /** 请求消息号：CHAMP_BUYTICKET_REQ (10402) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.CHAMP_BUYTICKET_REQ;
  /** 响应消息号：CHAMP_BUYTICKET_REP (10403) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.CHAMP_BUYTICKET_REP;

  Handle(req: ChampBuyTicketRequest): ChampBuyTicketResponse {
    throw new Error('Handle not implemented: NetMsg_ChampBuyTicket_CS');
  }
}
