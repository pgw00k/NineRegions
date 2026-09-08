// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_PullActAccept

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  PullActAcceptReq,
  PullActAcceptRep,
} from 'mc-local-share';

/**
 * NetMsg_PullActAccept
 * REQ = PullActAcceptReq
 * RES = PullActAcceptRep
 * 注册：reqId=10470,recId=10471
 */
export class NetMsg_PullActAccept extends MessageBase<PullActAcceptReq, PullActAcceptRep> {
  /** 请求消息号：PULL_ACT_ACCEPT_REQ (10470) */
  reqId: MESSAGE_ID = MESSAGE_ID.PULL_ACT_ACCEPT_REQ;
  /** 响应消息号：PULL_ACT_ACCEPT_REP (10471) */
  recId: MESSAGE_ID = MESSAGE_ID.PULL_ACT_ACCEPT_REP;

  override HandleSync(req: PullActAcceptReq, client?: Client, uid?: string, token?: string,exData?:any): PullActAcceptRep {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_PullActAccept');
    }
    return resobj
  }
}
