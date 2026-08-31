// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_QueryFriendInfo

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  QueryFriendInfoReq,
  QueryFriendInfoRsp,
} from 'mc-local-share';

/**
 * NetMsg_QueryFriendInfo
 * REQ = QueryFriendInfoReq
 * RES = QueryFriendInfoRsp
 * 注册：reqId=10460、recId=10461
 */
export class NetMsg_QueryFriendInfo extends MessageBase<QueryFriendInfoReq, QueryFriendInfoRsp> {
  /** 请求消息号：QUERY_FRIEND_INFO_REQ (10460) */
  reqId: MESSAGE_ID = MESSAGE_ID.QUERY_FRIEND_INFO_REQ;
  /** 响应消息号：QUERY_FRIEND_INFO_RSP (10461) */
  recId: MESSAGE_ID = MESSAGE_ID.QUERY_FRIEND_INFO_RSP;

  override Handle(req: QueryFriendInfoReq): QueryFriendInfoRsp {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_QueryFriendInfo');
    }
    return resobj
  }
}
