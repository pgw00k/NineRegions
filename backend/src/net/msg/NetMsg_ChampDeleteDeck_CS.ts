// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ChampDeleteDeck_CS

import { IHandle } from '../IHandle';
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
export class NetMsg_ChampDeleteDeck_CS implements IHandle<ChampDelDeckRequest, ChampDelDeckResponse> {
  /** 请求消息号：CHAMP_DEL_DECK_REQ (10412) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.CHAMP_DEL_DECK_REQ;
  /** 响应消息号：CHAMP_DEL_DECK_REP (10413) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.CHAMP_DEL_DECK_REP;

  Handle(req: ChampDelDeckRequest): ChampDelDeckResponse {
    throw new Error('Handle not implemented: NetMsg_ChampDeleteDeck_CS');
  }
}
