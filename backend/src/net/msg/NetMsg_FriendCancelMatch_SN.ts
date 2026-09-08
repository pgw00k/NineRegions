// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: FriendCancelMatch_SN

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  FriendOpStatusNtf,
} from 'mc-local-share';

/**
 * FriendCancelMatch_SN
 * REQ = {}
 * RES = FriendOpStatusNtf
 * 注册：reqId=0,recId=15037
 */
export class NetMsg_FriendCancelMatch_SN extends MessageBase<{}, FriendOpStatusNtf> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：FRIEND_OP_STATUS_NTF (15037) */
  recId: MESSAGE_ID = MESSAGE_ID.FRIEND_OP_STATUS_NTF;

  override HandleSync(req: {}, client?: Client, uid?: string, token?: string,exData?:any): FriendOpStatusNtf {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: FriendCancelMatch_SN');
    }
    return resobj
  }
}
