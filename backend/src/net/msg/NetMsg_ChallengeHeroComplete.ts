// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: ChallengeHeroComplete

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  ChallengeHeroComplete,
} from 'mc-local-share';

/**
 * ChallengeHeroComplete
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = ChallengeHeroComplete
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15022
 */
export class NetMsg_ChallengeHeroComplete implements IHandle<PlayerInfoSimple, ChallengeHeroComplete> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：CHALLENGE_HERO_COMPLETE (15022) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.CHALLENGE_HERO_COMPLETE;

  Handle(req: PlayerInfoSimple): ChallengeHeroComplete {
    throw new Error('Handle not implemented: ChallengeHeroComplete');
  }
}
