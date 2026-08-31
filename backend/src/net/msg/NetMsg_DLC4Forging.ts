// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_DLC4Forging

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  DLC4ForgingReq,
  DLC4ForgingRep,
} from 'mc-local-share';

/**
 * NetMsg_DLC4Forging
 * REQ = DLC4ForgingReq
 * RES = DLC4ForgingRep
 * 注册：reqId=10482、recId=10483
 */
export class NetMsg_DLC4Forging extends MessageBase<DLC4ForgingReq, DLC4ForgingRep> {
  /** 请求消息号：DLC4_FORGING_REQ (10482) */
  reqId: MESSAGE_ID = MESSAGE_ID.DLC4_FORGING_REQ;
  /** 响应消息号：DLC4_FORGING_REP (10483) */
  recId: MESSAGE_ID = MESSAGE_ID.DLC4_FORGING_REP;

  override Handle(req: DLC4ForgingReq): DLC4ForgingRep {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_DLC4Forging');
    }
    return resobj
  }
}
