// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_CS_StartMatchArena

import { IHandle } from '../IHandle';
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
export class NetMsg_StartMatchArena_CS implements IHandle<ArenaBattleRequest, ArenaBattleResponse> {
  /** 请求消息号：ARENA_BATTLE_REQ (10070) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.ARENA_BATTLE_REQ;
  /** 响应消息号：ARENA_BATTLE_REP (10071) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.ARENA_BATTLE_REP;

  Handle(req: ArenaBattleRequest): ArenaBattleResponse {
    throw new Error('Handle not implemented: NetMsg_CS_StartMatchArena');
  }
}
