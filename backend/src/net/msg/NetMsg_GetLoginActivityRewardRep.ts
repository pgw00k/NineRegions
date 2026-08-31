// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_GetLoginActivityRewardRep

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetLoginActivityRewardRep,
} from 'mc-local-share';

/**
 * NetMsg_GetLoginActivityRewardRep
 * REQ = {}
 * RES = GetLoginActivityRewardRep
 * 注册：reqId=0、recId=10343
 */
export class NetMsg_GetLoginActivityRewardRep extends MessageBase<{}, GetLoginActivityRewardRep> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：GET_LOGIN_ACTIVITY_REWARD_REP (10343) */
  recId: MESSAGE_ID = MESSAGE_ID.GET_LOGIN_ACTIVITY_REWARD_REP;

  override Handle(req: {}): GetLoginActivityRewardRep {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_GetLoginActivityRewardRep');
    }
    return resobj
  }
}
