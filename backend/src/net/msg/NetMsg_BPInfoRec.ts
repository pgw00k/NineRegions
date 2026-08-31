// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: BP_RecInfo

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  BattlePassResponse,
} from 'mc-local-share';

/**
 * BP_RecInfo
 * REQ = {}
 * RES = BattlePassResponse
 * 注册：reqId=0、recId=10281
 */
export class NetMsg_BPInfoRec extends MessageBase<{}, BattlePassResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：BATTLEPASS_REP (10281) */
  recId: MESSAGE_ID = MESSAGE_ID.BATTLEPASS_REP;

  override Handle(req: {}): BattlePassResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: BP_RecInfo');
    }
    return resobj
  }
}
