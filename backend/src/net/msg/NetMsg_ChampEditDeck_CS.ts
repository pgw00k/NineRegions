// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ChampEditDeck_CS

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  ChampEditDeckRequest,
  ChampEditDeckResponse,
} from 'mc-local-share';

/**
 * NetMsg_ChampEditDeck_CS
 * REQ = ChampEditDeckRequest
 * RES = ChampEditDeckResponse
 * 注册：reqId=10410、recId=10411
 */
export class NetMsg_ChampEditDeck_CS implements IHandle<ChampEditDeckRequest, ChampEditDeckResponse> {
  /** 请求消息号：CHAMP_EDIT_DECK_REQ (10410) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.CHAMP_EDIT_DECK_REQ;
  /** 响应消息号：CHAMP_EDIT_DECK_REP (10411) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.CHAMP_EDIT_DECK_REP;

  Handle(req: ChampEditDeckRequest): ChampEditDeckResponse {
    throw new Error('Handle not implemented: NetMsg_ChampEditDeck_CS');
  }
}
