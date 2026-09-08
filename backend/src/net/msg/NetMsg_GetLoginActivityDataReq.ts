// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_GetLoginActivityDataReq

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
} from 'mc-local-share';

/**
 * NetMsg_GetLoginActivityDataReq
 * REQ = {}
 * RES = {}
 * 注册：reqId=10340,recId=0
 */
export class NetMsg_GetLoginActivityDataReq extends MessageBase<{}, {}> {
  /** 请求消息号：GET_LOGIN_ACTIVITY_REQ (10340) */
  reqId: MESSAGE_ID = MESSAGE_ID.GET_LOGIN_ACTIVITY_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override HandleSync(req: {}, client?: Client): {} {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_GetLoginActivityDataReq');
    }
    return resobj
  }
}
