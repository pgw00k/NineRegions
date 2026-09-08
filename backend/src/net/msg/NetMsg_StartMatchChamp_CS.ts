// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_CS_StartMatchChamp

import { Client } from '../Client';
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
 * 注册：reqId=10404,recId=10405
 */
export class NetMsg_StartMatchChamp_CS extends MessageBase<ChampBattleRequest, ChampBattleResponse> {
  /** 请求消息号：CHAMP_BATTLE_REQ (10404) */
  reqId: MESSAGE_ID = MESSAGE_ID.CHAMP_BATTLE_REQ;
  /** 响应消息号：CHAMP_BATTLE_REP (10405) */
  recId: MESSAGE_ID = MESSAGE_ID.CHAMP_BATTLE_REP;

  override HandleSync(req: ChampBattleRequest, client?: Client, uid?: string, token?: string,exData?:any): ChampBattleResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_CS_StartMatchChamp');
    }
    return resobj
  }
}
