// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_FirstPayReward

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  FirstChargeRewardReq,
  FirstChargeRewardRep,
} from 'mc-local-share';

/**
 * NetMsg_FirstPayReward
 * REQ = FirstChargeRewardReq
 * RES = FirstChargeRewardRep
 * 注册：reqId=10381、recId=10382
 */
export class NetMsg_FirstPayReward extends MessageBase<FirstChargeRewardReq, FirstChargeRewardRep> {
  /** 请求消息号：FIRSTCHARGEREWARD_REQ (10381) */
  reqId: MESSAGE_ID = MESSAGE_ID.FIRSTCHARGEREWARD_REQ;
  /** 响应消息号：FIRSTCHARGEREWARD_REP (10382) */
  recId: MESSAGE_ID = MESSAGE_ID.FIRSTCHARGEREWARD_REP;

  override Handle(req: FirstChargeRewardReq): FirstChargeRewardRep {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_FirstPayReward');
    }
    return resobj
  }
}
