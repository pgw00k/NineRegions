// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: BP_LevelReward

import { IHandle } from '../IHandle';
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
export class NetMsg_BPLevelReward implements IHandle<BattlePassRewardRequest, BattlePassRewardResponse> {
  /** 请求消息号：BATTLEPASS_REWARD_REQ (10282) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.BATTLEPASS_REWARD_REQ;
  /** 响应消息号：BATTLEPASS_REWARD_REP (10283) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.BATTLEPASS_REWARD_REP;

  Handle(req: BattlePassRewardRequest): BattlePassRewardResponse {
    throw new Error('Handle not implemented: BP_LevelReward');
  }
}
