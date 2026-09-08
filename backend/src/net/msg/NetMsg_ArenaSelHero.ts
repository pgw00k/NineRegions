// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ArenaSelHero

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ArenaSelectHeroRequest,
  ArenaSelectHeroResponse,
} from 'mc-local-share';

/**
 * NetMsg_ArenaSelHero
 * REQ = ArenaSelectHeroRequest
 * RES = ArenaSelectHeroResponse
 * 注册：reqId=10064,recId=10065
 */
export class NetMsg_ArenaSelHero extends MessageBase<ArenaSelectHeroRequest, ArenaSelectHeroResponse> {
  /** 请求消息号：ARENA_SELECT_HERO_REQ (10064) */
  reqId: MESSAGE_ID = MESSAGE_ID.ARENA_SELECT_HERO_REQ;
  /** 响应消息号：ARENA_SELECT_HERO_REP (10065) */
  recId: MESSAGE_ID = MESSAGE_ID.ARENA_SELECT_HERO_REP;

  override HandleSync(req: ArenaSelectHeroRequest, client?: Client): ArenaSelectHeroResponse {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_ArenaSelHero');
    }
    return resobj
  }
}
