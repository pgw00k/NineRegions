// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: BP_Active

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  BattlePassActiveResponse,
} from 'mc-local-share';

/**
 * BP_Active
 * REQ = {}
 * RES = BattlePassActiveResponse
 * 注册：reqId=0、recId=10287
 */
export class NetMsg_BPActive extends MessageBase<{}, BattlePassActiveResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：BATTLEPASS_ACTIVE_REP (10287) */
  recId: MESSAGE_ID = MESSAGE_ID.BATTLEPASS_ACTIVE_REP;

  override Handle(req: {}): BattlePassActiveResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: BP_Active');
    }
    return resobj
  }
}
