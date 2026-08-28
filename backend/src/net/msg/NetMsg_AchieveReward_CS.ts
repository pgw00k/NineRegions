// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Achieve_Reward

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  GetAchieveRewardRequest,
  GetAchieveRewardResponse,
} from 'mc-local-share';

/**
 * Achieve_Reward
 * REQ = GetAchieveRewardRequest
 * RES = GetAchieveRewardResponse
 * 注册：reqId=10232、recId=10233
 */
export class NetMsg_AchieveReward_CS implements IHandle<GetAchieveRewardRequest, GetAchieveRewardResponse> {
  /** 请求消息号：GET_ACHIEVE_REWARD_REQ (10232) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.GET_ACHIEVE_REWARD_REQ;
  /** 响应消息号：GET_ACHIEVE_REWARD_REP (10233) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GET_ACHIEVE_REWARD_REP;

  Handle(req: GetAchieveRewardRequest): GetAchieveRewardResponse {
    throw new Error('Handle not implemented: Achieve_Reward');
  }
}
