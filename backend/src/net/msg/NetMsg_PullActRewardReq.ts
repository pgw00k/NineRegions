// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_PullActRewardReq

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  PullActRewardReq,
  PullActRewardRep,
} from 'mc-local-share';

/**
 * NetMsg_PullActRewardReq
 * REQ = PullActRewardReq
 * RES = PullActRewardRep
 * 注册：reqId=10472、recId=10473
 */
export class NetMsg_PullActRewardReq extends MessageBase<PullActRewardReq, PullActRewardRep> {
  /** 请求消息号：PULL_ACT_REWARD_REQ (10472) */
  reqId: MESSAGE_ID = MESSAGE_ID.PULL_ACT_REWARD_REQ;
  /** 响应消息号：PULL_ACT_REWARD_REP (10473) */
  recId: MESSAGE_ID = MESSAGE_ID.PULL_ACT_REWARD_REP;

  override Handle(req: PullActRewardReq): PullActRewardRep {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_PullActRewardReq');
    }
    return resobj
  }
}
