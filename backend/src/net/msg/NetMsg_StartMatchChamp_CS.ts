// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_CS_StartMatchChamp

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ChampBattleRequest,
  ChampBattleResponse,
} from 'mc-local-share';

/**
 * NetMsg_CS_StartMatchChamp
 * REQ = ChampBattleRequest
 * RES = ChampBattleResponse
 * 注册：reqId=10404、recId=10405
 */
export class NetMsg_StartMatchChamp_CS extends MessageBase<ChampBattleRequest, ChampBattleResponse> {
  /** 请求消息号：CHAMP_BATTLE_REQ (10404) */
  reqId: MESSAGE_ID = MESSAGE_ID.CHAMP_BATTLE_REQ;
  /** 响应消息号：CHAMP_BATTLE_REP (10405) */
  recId: MESSAGE_ID = MESSAGE_ID.CHAMP_BATTLE_REP;

  override Handle(req: ChampBattleRequest): ChampBattleResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_CS_StartMatchChamp');
    }
    return resobj
  }
}
