// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ChallengeHeroReq

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ChallengeHeroRequest,
} from 'mc-local-share';

/**
 * NetMsg_ChallengeHeroReq
 * REQ = ChallengeHeroRequest
 * RES = {}
 * 注册：reqId=10260、recId=0
 */
export class NetMsg_ChallengeHero_CN extends MessageBase<ChallengeHeroRequest, {}> {
  /** 请求消息号：CHALLENGE_HERO_REQ (10260) */
  reqId: MESSAGE_ID = MESSAGE_ID.CHALLENGE_HERO_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: ChallengeHeroRequest): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_ChallengeHeroReq');
    }
    return resobj
  }
}
