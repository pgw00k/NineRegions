// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ChallengeHeroReq

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  ChallengeHeroRequest,
} from 'mc-local-share';

/**
 * NetMsg_ChallengeHeroReq
 * REQ = ChallengeHeroRequest
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=10260、recId=-1
 */
export class NetMsg_ChallengeHero_CN implements IHandle<ChallengeHeroRequest, {}> {
  /** 请求消息号：CHALLENGE_HERO_REQ (10260) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.CHALLENGE_HERO_REQ;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: ChallengeHeroRequest): {} {
    throw new Error('Handle not implemented: NetMsg_ChallengeHeroReq');
  }
}
