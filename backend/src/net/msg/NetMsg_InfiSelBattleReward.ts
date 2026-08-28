// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Infi_SelBattleReward

import { IHandle } from '../IHandle';
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
export class NetMsg_InfiSelBattleReward implements IHandle<InfiSelectRewardRequest, InfiSelectRewardResponse> {
  /** 请求消息号：INFI_SELECT_REWARD_REQ (10097) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_REWARD_REQ;
  /** 响应消息号：INFI_SELECT_REWARD_REP (10098) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_REWARD_REP;

  Handle(req: InfiSelectRewardRequest): InfiSelectRewardResponse {
    throw new Error('Handle not implemented: Infi_SelBattleReward');
  }
}
