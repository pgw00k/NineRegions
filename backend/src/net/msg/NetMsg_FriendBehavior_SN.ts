// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_FriendBehavior_SN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  FriendBehaviorNtf,
} from 'mc-local-share';

/**
 * NetMsg_FriendBehavior_SN
 * REQ = {}
 * RES = FriendBehaviorNtf
 * 注册：reqId=0、recId=15025
 */
export class NetMsg_FriendBehavior_SN extends MessageBase<{}, FriendBehaviorNtf> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：FRIEND_BEHAVIOR_NTF (15025) */
  recId: MESSAGE_ID = MESSAGE_ID.FRIEND_BEHAVIOR_NTF;

  override Handle(req: {}): FriendBehaviorNtf {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_FriendBehavior_SN');
    }
    return resobj
  }
}
