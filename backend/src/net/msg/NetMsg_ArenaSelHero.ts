// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ArenaSelHero

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  ArenaSelectHeroRequest,
  ArenaSelectHeroResponse,
} from 'mc-local-share';

/**
 * NetMsg_ArenaSelHero
 * REQ = ArenaSelectHeroRequest
 * RES = ArenaSelectHeroResponse
 * 注册：reqId=10064、recId=10065
 */
export class NetMsg_ArenaSelHero implements IHandle<ArenaSelectHeroRequest, ArenaSelectHeroResponse> {
  /** 请求消息号：ARENA_SELECT_HERO_REQ (10064) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.ARENA_SELECT_HERO_REQ;
  /** 响应消息号：ARENA_SELECT_HERO_REP (10065) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.ARENA_SELECT_HERO_REP;

  Handle(req: ArenaSelectHeroRequest): ArenaSelectHeroResponse {
    throw new Error('Handle not implemented: NetMsg_ArenaSelHero');
  }
}
