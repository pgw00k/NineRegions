// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_PullActInfo

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  PullActInfoReq,
  PullActInfoRep,
} from 'mc-local-share';

/**
 * NetMsg_PullActInfo
 * REQ = PullActInfoReq
 * RES = PullActInfoRep
 * 注册：reqId=10474,recId=10475
 */
export class NetMsg_PullActInfo extends MessageBase<PullActInfoReq, PullActInfoRep> {
  /** 请求消息号：PULL_ACT_INFO_REQ (10474) */
  reqId: MESSAGE_ID = MESSAGE_ID.PULL_ACT_INFO_REQ;
  /** 响应消息号：PULL_ACT_INFO_REP (10475) */
  recId: MESSAGE_ID = MESSAGE_ID.PULL_ACT_INFO_REP;

  override HandleSync(req: PullActInfoReq, client?: Client): PullActInfoRep {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_PullActInfo');
    }
    return resobj
  }
}
