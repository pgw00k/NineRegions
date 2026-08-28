// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Infi_SelectHero

import { IHandle } from '../IHandle';
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
export class NetMsg_InfiSelectHero implements IHandle<InfiSelectHeroRequest, InfiSelectHeroResponse> {
  /** 请求消息号：INFI_SELECT_HERO_REQ (10084) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_HERO_REQ;
  /** 响应消息号：INFI_SELECT_HERO_REP (10085) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_HERO_REP;

  Handle(req: InfiSelectHeroRequest): InfiSelectHeroResponse {
    throw new Error('Handle not implemented: Infi_SelectHero');
  }
}
