// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: SetHeroSkin

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  SetHeroSkinRequest,
  SetHeroSkinResponse,
} from 'mc-local-share';

/**
 * SetHeroSkin
 * REQ = SetHeroSkinRequest
 * RES = SetHeroSkinResponse
 * 注册：reqId=10266、recId=10266
 */
export class NetMsg_SetHeroSkin extends MessageBase<SetHeroSkinRequest, SetHeroSkinResponse> {
  /** 请求消息号：SET_HERO_SKIN_REQ (10266) */
  reqId: MESSAGE_ID = MESSAGE_ID.SET_HERO_SKIN_REQ;
  /** 响应消息号：SET_HERO_SKIN_REQ (10266) */
  recId: MESSAGE_ID = MESSAGE_ID.SET_HERO_SKIN_REQ;

  override Handle(req: SetHeroSkinRequest): SetHeroSkinResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: SetHeroSkin');
    }
    return resobj
  }
}
