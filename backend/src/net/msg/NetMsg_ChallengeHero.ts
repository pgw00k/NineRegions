// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: ChallengeHero

import { IHandle } from '../IHandle';
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
export class NetMsg_ChallengeHero implements IHandle<ChallengeHeroRequest, ChallengeHeroResponse> {
  /** 请求消息号：CHALLENGE_HERO_REQ (10260) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.CHALLENGE_HERO_REQ;
  /** 响应消息号：CHALLENGE_HERO_REP (10261) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.CHALLENGE_HERO_REP;

  Handle(req: ChallengeHeroRequest): ChallengeHeroResponse {
    throw new Error('Handle not implemented: ChallengeHero');
  }
}
