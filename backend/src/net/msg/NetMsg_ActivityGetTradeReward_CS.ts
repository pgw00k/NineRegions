// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ActivityGetTradeReward_CS

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  GetActivityTradeRewardRequest,
  GetActivityTradeRewardResponse,
} from 'mc-local-share';

/**
 * NetMsg_ActivityGetTradeReward_CS
 * REQ = GetActivityTradeRewardRequest
 * RES = GetActivityTradeRewardResponse
 * 注册：reqId=10208、recId=10209
 */
export class NetMsg_ActivityGetTradeReward_CS implements IHandle<GetActivityTradeRewardRequest, GetActivityTradeRewardResponse> {
  /** 请求消息号：GET_ACTIVITY_TRADE_REWARD_REQ (10208) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.GET_ACTIVITY_TRADE_REWARD_REQ;
  /** 响应消息号：GET_ACTIVITY_TRADE_REWARD_REP (10209) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GET_ACTIVITY_TRADE_REWARD_REP;

  Handle(req: GetActivityTradeRewardRequest): GetActivityTradeRewardResponse {
    throw new Error('Handle not implemented: NetMsg_ActivityGetTradeReward_CS');
  }
}
