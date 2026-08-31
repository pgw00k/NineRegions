// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_FriendInfo_SN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  FriendInfoNtf,
} from 'mc-local-share';

/**
 * NetMsg_FriendInfo_SN
 * REQ = {}
 * RES = FriendInfoNtf
 * 注册：reqId=0、recId=15032
 */
export class NetMsg_FriendInfo_SN extends MessageBase<{}, FriendInfoNtf> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：FRIEND_INFO_NTF (15032) */
  recId: MESSAGE_ID = MESSAGE_ID.FRIEND_INFO_NTF;

  override Handle(req: {}): FriendInfoNtf {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_FriendInfo_SN');
    }
    return resobj
  }
}
