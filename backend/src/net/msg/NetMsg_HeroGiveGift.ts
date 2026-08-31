// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: HeroGiveGift

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  HeroGiveGiftRequest,
  HeroGiveGiftResponse,
} from 'mc-local-share';

/**
 * HeroGiveGift
 * REQ = HeroGiveGiftRequest
 * RES = HeroGiveGiftResponse
 * 注册：reqId=10262、recId=10263
 */
export class NetMsg_HeroGiveGift extends MessageBase<HeroGiveGiftRequest, HeroGiveGiftResponse> {
  /** 请求消息号：HERO_GIVE_GIFT_REQ (10262) */
  reqId: MESSAGE_ID = MESSAGE_ID.HERO_GIVE_GIFT_REQ;
  /** 响应消息号：HERO_GIVE_GIFT_REP (10263) */
  recId: MESSAGE_ID = MESSAGE_ID.HERO_GIVE_GIFT_REP;

  override Handle(req: HeroGiveGiftRequest): HeroGiveGiftResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: HeroGiveGift');
    }
    return resobj
  }
}
