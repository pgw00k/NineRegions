// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ArenaReward

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ArenaGetRewardRequest,
  ArenaGetRewardResponse,
} from 'mc-local-share';

/**
 * NetMsg_ArenaReward
 * REQ = ArenaGetRewardRequest
 * RES = ArenaGetRewardResponse
 * 注册：reqId=10068、recId=10069
 */
export class NetMsg_ArenaReward extends MessageBase<ArenaGetRewardRequest, ArenaGetRewardResponse> {
  /** 请求消息号：ARENA_GET_REWARDS_REQ (10068) */
  reqId: MESSAGE_ID = MESSAGE_ID.ARENA_GET_REWARDS_REQ;
  /** 响应消息号：ARENA_GET_REWARDS_REP (10069) */
  recId: MESSAGE_ID = MESSAGE_ID.ARENA_GET_REWARDS_REP;

  override Handle(req: ArenaGetRewardRequest): ArenaGetRewardResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_ArenaReward');
    }
    return resobj
  }
}
