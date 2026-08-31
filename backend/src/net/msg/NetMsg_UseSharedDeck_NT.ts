// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_UseSharedDeck_NT

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  UseSharedDeckNt,
} from 'mc-local-share';

/**
 * NetMsg_UseSharedDeck_NT
 * REQ = UseSharedDeckNt
 * RES = {}
 * 注册：reqId=15043、recId=0
 */
export class NetMsg_UseSharedDeck_NT extends MessageBase<UseSharedDeckNt, {}> {
  /** 请求消息号：USE_SHAREDDECK_NT (15043) */
  reqId: MESSAGE_ID = MESSAGE_ID.USE_SHAREDDECK_NT;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: UseSharedDeckNt): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_UseSharedDeck_NT');
    }
    return resobj
  }
}
