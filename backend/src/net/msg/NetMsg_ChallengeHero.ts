// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: ChallengeHero

import { Client } from '../Client';
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
 * 注册：reqId=10260,recId=10261
 */
export class NetMsg_ChallengeHero extends MessageBase<ChallengeHeroRequest, ChallengeHeroResponse> {
  /** 请求消息号：CHALLENGE_HERO_REQ (10260) */
  reqId: MESSAGE_ID = MESSAGE_ID.CHALLENGE_HERO_REQ;
  /** 响应消息号：CHALLENGE_HERO_REP (10261) */
  recId: MESSAGE_ID = MESSAGE_ID.CHALLENGE_HERO_REP;

  override HandleSync(req: ChallengeHeroRequest, client?: Client, uid?: string, token?: string,exData?:any): ChallengeHeroResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: ChallengeHero');
    }
    return resobj
  }
}
