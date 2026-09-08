// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_SelBattleReward

import { Client } from '../Client';
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
 * 注册：reqId=10097,recId=10098
 */
export class NetMsg_InfiSelBattleReward extends MessageBase<InfiSelectRewardRequest, InfiSelectRewardResponse> {
  /** 请求消息号：INFI_SELECT_REWARD_REQ (10097) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_REWARD_REQ;
  /** 响应消息号：INFI_SELECT_REWARD_REP (10098) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_REWARD_REP;

  override HandleSync(req: InfiSelectRewardRequest, client?: Client, uid?: string, token?: string,exData?:any): InfiSelectRewardResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: Infi_SelBattleReward');
    }
    return resobj
  }
}
