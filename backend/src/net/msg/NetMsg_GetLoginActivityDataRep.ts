// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_GetLoginActivityDataRep

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetLoginActivityDataRep,
} from 'mc-local-share';

/**
 * NetMsg_GetLoginActivityDataRep
 * REQ = {}
 * RES = GetLoginActivityDataRep
 * 注册：reqId=0、recId=10341
 */
export class NetMsg_GetLoginActivityDataRep extends MessageBase<{}, GetLoginActivityDataRep> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：GET_LOGIN_ACTIVITY_REP (10341) */
  recId: MESSAGE_ID = MESSAGE_ID.GET_LOGIN_ACTIVITY_REP;

  override Handle(req: {}): GetLoginActivityDataRep {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_GetLoginActivityDataRep');
    }
    return resobj
  }
}
