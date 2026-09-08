// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_FriendInfo_CN

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  FriendInfoRpt,
} from 'mc-local-share';

/**
 * NetMsg_FriendInfo_CN
 * REQ = FriendInfoRpt
 * RES = {}
 * 注册：reqId=15031,recId=0
 */
export class NetMsg_FriendInfo_CN extends MessageBase<FriendInfoRpt, {}> {
  /** 请求消息号：FRIEND_INFO_RPT (15031) */
  reqId: MESSAGE_ID = MESSAGE_ID.FRIEND_INFO_RPT;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override HandleSync(req: FriendInfoRpt, client?: Client): {} {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_FriendInfo_CN');
    }
    return resobj
  }
}
