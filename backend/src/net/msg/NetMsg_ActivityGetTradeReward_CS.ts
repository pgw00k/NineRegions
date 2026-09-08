// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ActivityGetTradeReward_CS

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetActivityTradeRewardRequest,
  GetActivityTradeRewardResponse,
} from 'mc-local-share';

/**
 * NetMsg_ActivityGetTradeReward_CS
 * REQ = GetActivityTradeRewardRequest
 * RES = GetActivityTradeRewardResponse
 * 注册：reqId=10208,recId=10209
 */
export class NetMsg_ActivityGetTradeReward_CS extends MessageBase<GetActivityTradeRewardRequest, GetActivityTradeRewardResponse> {
  /** 请求消息号：GET_ACTIVITY_TRADE_REWARD_REQ (10208) */
  reqId: MESSAGE_ID = MESSAGE_ID.GET_ACTIVITY_TRADE_REWARD_REQ;
  /** 响应消息号：GET_ACTIVITY_TRADE_REWARD_REP (10209) */
  recId: MESSAGE_ID = MESSAGE_ID.GET_ACTIVITY_TRADE_REWARD_REP;

  override HandleSync(req: GetActivityTradeRewardRequest, client?: Client): GetActivityTradeRewardResponse {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_ActivityGetTradeReward_CS');
    }
    return resobj
  }
}
