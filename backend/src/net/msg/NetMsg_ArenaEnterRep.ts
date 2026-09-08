// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ArenaEnterRep

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ArenaEnterResponse,
} from 'mc-local-share';

/**
 * NetMsg_ArenaEnterRep
 * REQ = {}
 * RES = ArenaEnterResponse
 * 注册：reqId=0,recId=10061
 */
export class NetMsg_ArenaEnterRep extends MessageBase<{}, ArenaEnterResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：ARENA_ENTER_REP (10061) */
  recId: MESSAGE_ID = MESSAGE_ID.ARENA_ENTER_REP;

  override HandleSync(req: {}, client?: Client): ArenaEnterResponse {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_ArenaEnterRep');
    }
    return resobj
  }
}
