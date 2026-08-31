// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: BP_LevelReward

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  BattlePassRewardRequest,
  BattlePassRewardResponse,
} from 'mc-local-share';

/**
 * BP_LevelReward
 * REQ = BattlePassRewardRequest
 * RES = BattlePassRewardResponse
 * 注册：reqId=10282、recId=10283
 */
export class NetMsg_BPLevelReward extends MessageBase<BattlePassRewardRequest, BattlePassRewardResponse> {
  /** 请求消息号：BATTLEPASS_REWARD_REQ (10282) */
  reqId: MESSAGE_ID = MESSAGE_ID.BATTLEPASS_REWARD_REQ;
  /** 响应消息号：BATTLEPASS_REWARD_REP (10283) */
  recId: MESSAGE_ID = MESSAGE_ID.BATTLEPASS_REWARD_REP;

  override Handle(req: BattlePassRewardRequest): BattlePassRewardResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: BP_LevelReward');
    }
    return resobj
  }
}
