// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: SetHeroSkin

import { IHandle } from '../IHandle';
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
export class NetMsg_SetHeroSkin implements IHandle<SetHeroSkinRequest, SetHeroSkinResponse> {
  /** 请求消息号：SET_HERO_SKIN_REQ (10266) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.SET_HERO_SKIN_REQ;
  /** 响应消息号：SET_HERO_SKIN_REQ (10266) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.SET_HERO_SKIN_REQ;

  Handle(req: SetHeroSkinRequest): SetHeroSkinResponse {
    throw new Error('Handle not implemented: SetHeroSkin');
  }
}
