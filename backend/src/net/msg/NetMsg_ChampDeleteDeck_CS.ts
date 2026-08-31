// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ChampDeleteDeck_CS

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ChampDelDeckRequest,
  ChampDelDeckResponse,
} from 'mc-local-share';

/**
 * NetMsg_ChampDeleteDeck_CS
 * REQ = ChampDelDeckRequest
 * RES = ChampDelDeckResponse
 * 注册：reqId=10412、recId=10413
 */
export class NetMsg_ChampDeleteDeck_CS extends MessageBase<ChampDelDeckRequest, ChampDelDeckResponse> {
  /** 请求消息号：CHAMP_DEL_DECK_REQ (10412) */
  reqId: MESSAGE_ID = MESSAGE_ID.CHAMP_DEL_DECK_REQ;
  /** 响应消息号：CHAMP_DEL_DECK_REP (10413) */
  recId: MESSAGE_ID = MESSAGE_ID.CHAMP_DEL_DECK_REP;

  override Handle(req: ChampDelDeckRequest): ChampDelDeckResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_ChampDeleteDeck_CS');
    }
    return resobj
  }
}
