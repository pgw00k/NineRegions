// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_SelectHero

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiSelectHeroRequest,
  InfiSelectHeroResponse,
} from 'mc-local-share';

/**
 * Infi_SelectHero
 * REQ = InfiSelectHeroRequest
 * RES = InfiSelectHeroResponse
 * 注册：reqId=10084、recId=10085
 */
export class NetMsg_InfiSelectHero extends MessageBase<InfiSelectHeroRequest, InfiSelectHeroResponse> {
  /** 请求消息号：INFI_SELECT_HERO_REQ (10084) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_HERO_REQ;
  /** 响应消息号：INFI_SELECT_HERO_REP (10085) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_HERO_REP;

  override Handle(req: InfiSelectHeroRequest): InfiSelectHeroResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Infi_SelectHero');
    }
    return resobj
  }
}
