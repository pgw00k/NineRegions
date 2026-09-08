// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_FriendRefresh_SN

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  FriendRefreshRearchNtf,
} from 'mc-local-share';

/**
 * NetMsg_FriendRefresh_SN
 * REQ = {}
 * RES = FriendRefreshRearchNtf
 * 注册：reqId=0,recId=15039
 */
export class NetMsg_FriendRefresh_SN extends MessageBase<{}, FriendRefreshRearchNtf> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：FRIEND_REFRESH_SREARCH_NTF (15039) */
  recId: MESSAGE_ID = MESSAGE_ID.FRIEND_REFRESH_SREARCH_NTF;

  override HandleSync(req: {}, client?: Client, uid?: string, token?: string,exData?:any): FriendRefreshRearchNtf {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_FriendRefresh_SN');
    }
    return resobj
  }
}
