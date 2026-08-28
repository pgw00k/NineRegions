// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ActivityGetReward_CS

import { IHandle } from '../IHandle';
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
export class NetMsg_ActivityGetReward_CS implements IHandle<GetActivityRewardRequest, GetActivityRewardResponse> {
  /** 请求消息号：GET_ACTIVITY_REWARD_REQ (10206) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.GET_ACTIVITY_REWARD_REQ;
  /** 响应消息号：GET_ACTIVITY_REWARD_REP (10207) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GET_ACTIVITY_REWARD_REP;

  Handle(req: GetActivityRewardRequest): GetActivityRewardResponse {
    throw new Error('Handle not implemented: NetMsg_ActivityGetReward_CS');
  }
}
