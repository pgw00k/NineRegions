// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ChampEditDeck_CS

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ChampEditDeckRequest,
  ChampEditDeckResponse,
} from 'mc-local-share';

/**
 * NetMsg_ChampEditDeck_CS
 * REQ = ChampEditDeckRequest
 * RES = ChampEditDeckResponse
 * 注册：reqId=10410,recId=10411
 */
export class NetMsg_ChampEditDeck_CS extends MessageBase<ChampEditDeckRequest, ChampEditDeckResponse> {
  /** 请求消息号：CHAMP_EDIT_DECK_REQ (10410) */
  reqId: MESSAGE_ID = MESSAGE_ID.CHAMP_EDIT_DECK_REQ;
  /** 响应消息号：CHAMP_EDIT_DECK_REP (10411) */
  recId: MESSAGE_ID = MESSAGE_ID.CHAMP_EDIT_DECK_REP;

  override HandleSync(req: ChampEditDeckRequest, client?: Client): ChampEditDeckResponse {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_ChampEditDeck_CS');
    }
    return resobj
  }
}
