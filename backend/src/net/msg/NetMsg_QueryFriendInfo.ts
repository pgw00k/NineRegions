// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_QueryFriendInfo

import { IHandle } from '../IHandle';
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
export class NetMsg_QueryFriendInfo implements IHandle<QueryFriendInfoReq, QueryFriendInfoRsp> {
  /** 请求消息号：QUERY_FRIEND_INFO_REQ (10460) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.QUERY_FRIEND_INFO_REQ;
  /** 响应消息号：QUERY_FRIEND_INFO_RSP (10461) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.QUERY_FRIEND_INFO_RSP;

  Handle(req: QueryFriendInfoReq): QueryFriendInfoRsp {
    throw new Error('Handle not implemented: NetMsg_QueryFriendInfo');
  }
}
