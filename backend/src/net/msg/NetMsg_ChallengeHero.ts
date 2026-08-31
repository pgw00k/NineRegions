// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: ChallengeHero

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ChallengeHeroRequest,
  ChallengeHeroResponse,
} from 'mc-local-share';

/**
 * ChallengeHero
 * REQ = ChallengeHeroRequest
 * RES = ChallengeHeroResponse
 * 注册：reqId=10260、recId=10261
 */
export class NetMsg_ChallengeHero extends MessageBase<ChallengeHeroRequest, ChallengeHeroResponse> {
  /** 请求消息号：CHALLENGE_HERO_REQ (10260) */
  reqId: MESSAGE_ID = MESSAGE_ID.CHALLENGE_HERO_REQ;
  /** 响应消息号：CHALLENGE_HERO_REP (10261) */
  recId: MESSAGE_ID = MESSAGE_ID.CHALLENGE_HERO_REP;

  override Handle(req: ChallengeHeroRequest): ChallengeHeroResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: ChallengeHero');
    }
    return resobj
  }
}
