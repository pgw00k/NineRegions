// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Reconnect

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  LogicReconnectionRequest,
} from 'mc-local-share';

/**
 * Reconnect
 * REQ = LogicReconnectionRequest
 * RES = {}
 * 注册：reqId=10011,recId=0
 */
export class NetMsg_Reconnect extends MessageBase<LogicReconnectionRequest, {}> {
  /** 请求消息号：LOGIC_RECONNECTION_REQ (10011) */
  reqId: MESSAGE_ID = MESSAGE_ID.LOGIC_RECONNECTION_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override HandleSync(req: LogicReconnectionRequest, client?: Client, uid?: string, token?: string,exData?:any): {} {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: Reconnect');
    }
    return resobj
  }
}
