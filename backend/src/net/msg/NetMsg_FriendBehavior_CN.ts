// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_FriendBehavior_CN

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  FriendBehaviorRpt,
} from 'mc-local-share';

/**
 * NetMsg_FriendBehavior_CN
 * REQ = FriendBehaviorRpt
 * RES = {}
 * 注册：reqId=15024,recId=0
 */
export class NetMsg_FriendBehavior_CN extends MessageBase<FriendBehaviorRpt, {}> {
  /** 请求消息号：FRIEND_BEHAVIOR_RPT (15024) */
  reqId: MESSAGE_ID = MESSAGE_ID.FRIEND_BEHAVIOR_RPT;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override HandleSync(req: FriendBehaviorRpt, client?: Client, uid?: string, token?: string,exData?:any): {} {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_FriendBehavior_CN');
    }
    return resobj
  }
}
