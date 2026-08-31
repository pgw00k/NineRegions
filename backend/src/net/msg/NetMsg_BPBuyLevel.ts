// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: BP_BuyLevel

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  BattlePassBuyExpRequest,
  BattlePassBuyExpResponse,
} from 'mc-local-share';

/**
 * BP_BuyLevel
 * REQ = BattlePassBuyExpRequest
 * RES = BattlePassBuyExpResponse
 * 注册：reqId=10284、recId=10285
 */
export class NetMsg_BPBuyLevel extends MessageBase<BattlePassBuyExpRequest, BattlePassBuyExpResponse> {
  /** 请求消息号：BATTLEPASS_BUY_EXP_REQ (10284) */
  reqId: MESSAGE_ID = MESSAGE_ID.BATTLEPASS_BUY_EXP_REQ;
  /** 响应消息号：BATTLEPASS_BUY_EXP_REP (10285) */
  recId: MESSAGE_ID = MESSAGE_ID.BATTLEPASS_BUY_EXP_REP;

  override Handle(req: BattlePassBuyExpRequest): BattlePassBuyExpResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: BP_BuyLevel');
    }
    return resobj
  }
}
