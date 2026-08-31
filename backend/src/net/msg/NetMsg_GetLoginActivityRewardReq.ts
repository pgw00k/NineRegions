// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_GetLoginActivityRewardReq

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetLoginActivityRewardReq,
} from 'mc-local-share';

/**
 * NetMsg_GetLoginActivityRewardReq
 * REQ = GetLoginActivityRewardReq
 * RES = {}
 * 注册：reqId=10342、recId=0
 */
export class NetMsg_GetLoginActivityRewardReq extends MessageBase<GetLoginActivityRewardReq, {}> {
  /** 请求消息号：GET_LOGIN_ACTIVITY_REWARD_REQ (10342) */
  reqId: MESSAGE_ID = MESSAGE_ID.GET_LOGIN_ACTIVITY_REWARD_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: GetLoginActivityRewardReq): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_GetLoginActivityRewardReq');
    }
    return resobj
  }
}
