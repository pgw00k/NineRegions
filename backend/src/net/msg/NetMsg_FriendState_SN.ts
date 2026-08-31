// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_FriendState_SN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  FriendStateNtf,
} from 'mc-local-share';

/**
 * NetMsg_FriendState_SN
 * REQ = {}
 * RES = FriendStateNtf
 * 注册：reqId=0、recId=15033
 */
export class NetMsg_FriendState_SN extends MessageBase<{}, FriendStateNtf> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：FRIEND_STATE_NTF (15033) */
  recId: MESSAGE_ID = MESSAGE_ID.FRIEND_STATE_NTF;

  override Handle(req: {}): FriendStateNtf {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_FriendState_SN');
    }
    return resobj
  }
}
