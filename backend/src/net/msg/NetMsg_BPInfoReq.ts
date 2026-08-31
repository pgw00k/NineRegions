// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: BP_ReqInfo

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  BattlePassRequest,
} from 'mc-local-share';

/**
 * BP_ReqInfo
 * REQ = BattlePassRequest
 * RES = {}
 * 注册：reqId=10280、recId=0
 */
export class NetMsg_BPInfoReq extends MessageBase<BattlePassRequest, {}> {
  /** 请求消息号：BATTLEPASS_REQ (10280) */
  reqId: MESSAGE_ID = MESSAGE_ID.BATTLEPASS_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: BattlePassRequest): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: BP_ReqInfo');
    }
    return resobj
  }
}
