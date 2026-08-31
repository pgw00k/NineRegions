// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_PushStateChange

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiStateChangePush,
} from 'mc-local-share';

/**
 * Infi_PushStateChange
 * REQ = {}
 * RES = InfiStateChangePush
 * 注册：reqId=0、recId=15015
 */
export class NetMsg_InfiPushStateChange extends MessageBase<{}, InfiStateChangePush> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：INFI_STATE_CHANGE_PUSH (15015) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_STATE_CHANGE_PUSH;

  override Handle(req: {}): InfiStateChangePush {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Infi_PushStateChange');
    }
    return resobj
  }
}
