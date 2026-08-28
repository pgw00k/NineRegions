// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_PullActRewardReq

import { IHandle } from '../IHandle';
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
export class NetMsg_PullActRewardReq implements IHandle<PullActRewardReq, PullActRewardRep> {
  /** 请求消息号：PULL_ACT_REWARD_REQ (10472) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.PULL_ACT_REWARD_REQ;
  /** 响应消息号：PULL_ACT_REWARD_REP (10473) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.PULL_ACT_REWARD_REP;

  Handle(req: PullActRewardReq): PullActRewardRep {
    throw new Error('Handle not implemented: NetMsg_PullActRewardReq');
  }
}
