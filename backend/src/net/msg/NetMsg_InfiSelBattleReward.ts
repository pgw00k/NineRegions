// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_SelBattleReward

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiSelectRewardRequest,
  InfiSelectRewardResponse,
} from 'mc-local-share';

/**
 * Infi_SelBattleReward
 * REQ = InfiSelectRewardRequest
 * RES = InfiSelectRewardResponse
 * 注册：reqId=10097、recId=10098
 */
export class NetMsg_InfiSelBattleReward extends MessageBase<InfiSelectRewardRequest, InfiSelectRewardResponse> {
  /** 请求消息号：INFI_SELECT_REWARD_REQ (10097) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_REWARD_REQ;
  /** 响应消息号：INFI_SELECT_REWARD_REP (10098) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_REWARD_REP;

  override Handle(req: InfiSelectRewardRequest): InfiSelectRewardResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Infi_SelBattleReward');
    }
    return resobj
  }
}
