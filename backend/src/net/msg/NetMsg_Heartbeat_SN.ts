// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_SN_Heartbeat

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  HeartbeatRep,
} from 'mc-local-share';

/**
 * NetMsg_SN_Heartbeat
 * REQ = {}
 * RES = HeartbeatRep
 * 注册：reqId=0,recId=10004
 */
export class NetMsg_Heartbeat_SN extends MessageBase<{}, HeartbeatRep> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：HEARTBEAT_REP (10004) */
  recId: MESSAGE_ID = MESSAGE_ID.HEARTBEAT_REP;

  override HandleSync(req: {}, client?: Client, uid?: string, token?: string,exData?:any): HeartbeatRep {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_SN_Heartbeat');
    }
    return resobj
  }
}
