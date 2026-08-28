// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ArenaGiveUp

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  ArenaGiveUpRequest,
  ArenaGiveUpResponse,
} from 'mc-local-share';

/**
 * NetMsg_ArenaGiveUp
 * REQ = ArenaGiveUpRequest
 * RES = ArenaGiveUpResponse
 * 注册：reqId=10075、recId=10076
 */
export class NetMsg_ArenaGiveUp implements IHandle<ArenaGiveUpRequest, ArenaGiveUpResponse> {
  /** 请求消息号：ARENA_GIVEUP_REQ (10075) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.ARENA_GIVEUP_REQ;
  /** 响应消息号：ARENA_GIVEUP_REP (10076) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.ARENA_GIVEUP_REP;

  Handle(req: ArenaGiveUpRequest): ArenaGiveUpResponse {
    throw new Error('Handle not implemented: NetMsg_ArenaGiveUp');
  }
}
