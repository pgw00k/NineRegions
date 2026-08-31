// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_CS_StartMatchArena

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ArenaBattleRequest,
  ArenaBattleResponse,
} from 'mc-local-share';

/**
 * NetMsg_CS_StartMatchArena
 * REQ = ArenaBattleRequest
 * RES = ArenaBattleResponse
 * 注册：reqId=10070、recId=10071
 */
export class NetMsg_StartMatchArena_CS extends MessageBase<ArenaBattleRequest, ArenaBattleResponse> {
  /** 请求消息号：ARENA_BATTLE_REQ (10070) */
  reqId: MESSAGE_ID = MESSAGE_ID.ARENA_BATTLE_REQ;
  /** 响应消息号：ARENA_BATTLE_REP (10071) */
  recId: MESSAGE_ID = MESSAGE_ID.ARENA_BATTLE_REP;

  override Handle(req: ArenaBattleRequest): ArenaBattleResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_CS_StartMatchArena');
    }
    return resobj
  }
}
