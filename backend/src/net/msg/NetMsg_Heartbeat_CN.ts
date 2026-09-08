// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_CN_Heartbeat

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  HeartbeatReq,
} from 'mc-local-share';

/**
 * NetMsg_CN_Heartbeat
 * REQ = HeartbeatReq
 * RES = {}
 * 注册：reqId=10003,recId=0
 */
export class NetMsg_Heartbeat_CN extends MessageBase<HeartbeatReq, {}> {
  /** 请求消息号：HEARTBEAT_REQ (10003) */
  reqId: MESSAGE_ID = MESSAGE_ID.HEARTBEAT_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override HandleSync(req: HeartbeatReq, client?: Client): {} {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_CN_Heartbeat');
    }
    return resobj
  }
}
