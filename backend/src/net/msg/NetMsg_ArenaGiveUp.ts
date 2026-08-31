// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ArenaGiveUp

import { MessageBase } from '../MessageBase';
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
export class NetMsg_ArenaGiveUp extends MessageBase<ArenaGiveUpRequest, ArenaGiveUpResponse> {
  /** 请求消息号：ARENA_GIVEUP_REQ (10075) */
  reqId: MESSAGE_ID = MESSAGE_ID.ARENA_GIVEUP_REQ;
  /** 响应消息号：ARENA_GIVEUP_REP (10076) */
  recId: MESSAGE_ID = MESSAGE_ID.ARENA_GIVEUP_REP;

  override Handle(req: ArenaGiveUpRequest): ArenaGiveUpResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_ArenaGiveUp');
    }
    return resobj
  }
}
