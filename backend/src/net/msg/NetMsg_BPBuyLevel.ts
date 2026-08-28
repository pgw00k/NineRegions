// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: BP_BuyLevel

import { IHandle } from '../IHandle';
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
export class NetMsg_BPBuyLevel implements IHandle<BattlePassBuyExpRequest, BattlePassBuyExpResponse> {
  /** 请求消息号：BATTLEPASS_BUY_EXP_REQ (10284) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.BATTLEPASS_BUY_EXP_REQ;
  /** 响应消息号：BATTLEPASS_BUY_EXP_REP (10285) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.BATTLEPASS_BUY_EXP_REP;

  Handle(req: BattlePassBuyExpRequest): BattlePassBuyExpResponse {
    throw new Error('Handle not implemented: BP_BuyLevel');
  }
}
