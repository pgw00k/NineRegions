// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Notice_Push

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  TipsNotice,
} from 'mc-local-share';

/**
 * Notice_Push
 * REQ = {}
 * RES = TipsNotice
 * 注册：reqId=0、recId=10273
 */
export class NetMsg_NoticePush extends MessageBase<{}, TipsNotice> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：TIPS_NOTICE (10273) */
  recId: MESSAGE_ID = MESSAGE_ID.TIPS_NOTICE;

  override Handle(req: {}): TipsNotice {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Notice_Push');
    }
    return resobj
  }
}
