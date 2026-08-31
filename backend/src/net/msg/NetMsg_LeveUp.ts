// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_LevelUp

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  PushLevelup,
} from 'mc-local-share';

/**
 * NetMsg_LevelUp
 * REQ = {}
 * RES = PushLevelup
 * 注册：reqId=0、recId=15005
 */
export class NetMsg_LeveUp extends MessageBase<{}, PushLevelup> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：PUSH_LEVELUP (15005) */
  recId: MESSAGE_ID = MESSAGE_ID.PUSH_LEVELUP;

  override Handle(req: {}): PushLevelup {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_LevelUp');
    }
    return resobj
  }
}
