// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: ChallengeHeroComplete

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ChallengeHeroComplete,
} from 'mc-local-share';

/**
 * ChallengeHeroComplete
 * REQ = {}
 * RES = ChallengeHeroComplete
 * 注册：reqId=0,recId=15022
 */
export class NetMsg_ChallengeHeroComplete extends MessageBase<{}, ChallengeHeroComplete> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：CHALLENGE_HERO_COMPLETE (15022) */
  recId: MESSAGE_ID = MESSAGE_ID.CHALLENGE_HERO_COMPLETE;

  override HandleSync(req: {}, client?: Client): ChallengeHeroComplete {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: ChallengeHeroComplete');
    }
    return resobj
  }
}
