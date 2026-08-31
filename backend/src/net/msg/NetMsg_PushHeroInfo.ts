// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: PushHeroInfo

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  PushHeroSimpleInfo,
} from 'mc-local-share';

/**
 * PushHeroInfo
 * REQ = {}
 * RES = PushHeroSimpleInfo
 * 注册：reqId=0、recId=15023
 */
export class NetMsg_PushHeroInfo extends MessageBase<{}, PushHeroSimpleInfo> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：PUSH_HERO_INFO (15023) */
  recId: MESSAGE_ID = MESSAGE_ID.PUSH_HERO_INFO;

  override Handle(req: {}): PushHeroSimpleInfo {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: PushHeroInfo');
    }
    return resobj
  }
}
