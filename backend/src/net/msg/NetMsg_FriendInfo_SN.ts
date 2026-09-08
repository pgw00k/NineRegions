// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_FriendInfo_SN

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  FriendInfoNtf,
} from 'mc-local-share';

/**
 * NetMsg_FriendInfo_SN
 * REQ = {}
 * RES = FriendInfoNtf
 * 注册：reqId=0,recId=15032
 */
export class NetMsg_FriendInfo_SN extends MessageBase<{}, FriendInfoNtf> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：FRIEND_INFO_NTF (15032) */
  recId: MESSAGE_ID = MESSAGE_ID.FRIEND_INFO_NTF;

  override HandleSync(req: {}, client?: Client): FriendInfoNtf {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_FriendInfo_SN');
    }
    return resobj
  }
}
