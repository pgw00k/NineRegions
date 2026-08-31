// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: GetFavorReward

import { MessageBase } from '../MessageBase';
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
export class NetMsg_GetFavorReward extends MessageBase<GetFavorRewardRequest, GetFavorRewardResponse> {
  /** 请求消息号：GET_FAVOR_REWARD_REQ (10264) */
  reqId: MESSAGE_ID = MESSAGE_ID.GET_FAVOR_REWARD_REQ;
  /** 响应消息号：GET_FAVOR_REWARD_REP (10265) */
  recId: MESSAGE_ID = MESSAGE_ID.GET_FAVOR_REWARD_REP;

  override Handle(req: GetFavorRewardRequest): GetFavorRewardResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: GetFavorReward');
    }
    return resobj
  }
}
