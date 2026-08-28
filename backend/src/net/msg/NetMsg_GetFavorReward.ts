// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: GetFavorReward

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  GetFavorRewardRequest,
  GetFavorRewardResponse,
} from 'mc-local-share';

/**
 * GetFavorReward
 * REQ = GetFavorRewardRequest
 * RES = GetFavorRewardResponse
 * 注册：reqId=10264、recId=10265
 */
export class NetMsg_GetFavorReward implements IHandle<GetFavorRewardRequest, GetFavorRewardResponse> {
  /** 请求消息号：GET_FAVOR_REWARD_REQ (10264) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.GET_FAVOR_REWARD_REQ;
  /** 响应消息号：GET_FAVOR_REWARD_REP (10265) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GET_FAVOR_REWARD_REP;

  Handle(req: GetFavorRewardRequest): GetFavorRewardResponse {
    throw new Error('Handle not implemented: GetFavorReward');
  }
}
