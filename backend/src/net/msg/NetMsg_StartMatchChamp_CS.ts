// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_CS_StartMatchChamp

import { IHandle } from '../IHandle';
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
export class NetMsg_StartMatchChamp_CS implements IHandle<ChampBattleRequest, ChampBattleResponse> {
  /** 请求消息号：CHAMP_BATTLE_REQ (10404) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.CHAMP_BATTLE_REQ;
  /** 响应消息号：CHAMP_BATTLE_REP (10405) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.CHAMP_BATTLE_REP;

  Handle(req: ChampBattleRequest): ChampBattleResponse {
    throw new Error('Handle not implemented: NetMsg_CS_StartMatchChamp');
  }
}
