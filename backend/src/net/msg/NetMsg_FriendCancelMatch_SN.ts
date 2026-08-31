// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: FriendCancelMatch_SN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  FriendOpStatusNtf,
} from 'mc-local-share';

/**
 * FriendCancelMatch_SN
 * REQ = {}
 * RES = FriendOpStatusNtf
 * 注册：reqId=0、recId=15037
 */
export class NetMsg_FriendCancelMatch_SN extends MessageBase<{}, FriendOpStatusNtf> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：FRIEND_OP_STATUS_NTF (15037) */
  recId: MESSAGE_ID = MESSAGE_ID.FRIEND_OP_STATUS_NTF;

  override Handle(req: {}): FriendOpStatusNtf {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: FriendCancelMatch_SN');
    }
    return resobj
  }
}
