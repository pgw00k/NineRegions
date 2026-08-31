// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ArenaEnterReq

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ArenaEnterRequest,
} from 'mc-local-share';

/**
 * NetMsg_ArenaEnterReq
 * REQ = ArenaEnterRequest
 * RES = {}
 * 注册：reqId=10060、recId=0
 */
export class NetMsg_ArenaEnterReq extends MessageBase<ArenaEnterRequest, {}> {
  /** 请求消息号：ARENA_ENTER_REQ (10060) */
  reqId: MESSAGE_ID = MESSAGE_ID.ARENA_ENTER_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: ArenaEnterRequest): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_ArenaEnterReq');
    }
    return resobj
  }
}
