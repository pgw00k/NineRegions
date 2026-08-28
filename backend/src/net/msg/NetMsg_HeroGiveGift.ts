// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: HeroGiveGift

import { IHandle } from '../IHandle';
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
export class NetMsg_HeroGiveGift implements IHandle<HeroGiveGiftRequest, HeroGiveGiftResponse> {
  /** 请求消息号：HERO_GIVE_GIFT_REQ (10262) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.HERO_GIVE_GIFT_REQ;
  /** 响应消息号：HERO_GIVE_GIFT_REP (10263) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.HERO_GIVE_GIFT_REP;

  Handle(req: HeroGiveGiftRequest): HeroGiveGiftResponse {
    throw new Error('Handle not implemented: HeroGiveGift');
  }
}
