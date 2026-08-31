// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_PVECompletePush

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  PushPVEComplete,
} from 'mc-local-share';

/**
 * NetMsg_PVECompletePush
 * REQ = {}
 * RES = PushPVEComplete
 * 注册：reqId=0、recId=15003
 */
export class NetMsg_PVECompletePush extends MessageBase<{}, PushPVEComplete> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：PUSH_PVECOMPLETE (15003) */
  recId: MESSAGE_ID = MESSAGE_ID.PUSH_PVECOMPLETE;

  override Handle(req: {}): PushPVEComplete {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_PVECompletePush');
    }
    return resobj
  }
}
