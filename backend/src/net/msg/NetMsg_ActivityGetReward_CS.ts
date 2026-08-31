// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ActivityGetReward_CS

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetActivityRewardRequest,
  GetActivityRewardResponse,
} from 'mc-local-share';

/**
 * NetMsg_ActivityGetReward_CS
 * REQ = GetActivityRewardRequest
 * RES = GetActivityRewardResponse
 * 注册：reqId=10206、recId=10207
 */
export class NetMsg_ActivityGetReward_CS extends MessageBase<GetActivityRewardRequest, GetActivityRewardResponse> {
  /** 请求消息号：GET_ACTIVITY_REWARD_REQ (10206) */
  reqId: MESSAGE_ID = MESSAGE_ID.GET_ACTIVITY_REWARD_REQ;
  /** 响应消息号：GET_ACTIVITY_REWARD_REP (10207) */
  recId: MESSAGE_ID = MESSAGE_ID.GET_ACTIVITY_REWARD_REP;

  override Handle(req: GetActivityRewardRequest): GetActivityRewardResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_ActivityGetReward_CS');
    }
    return resobj
  }
}
