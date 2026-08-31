// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_QueryUserTitelInfo_CN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  QueryUserTitelInfoReq,
} from 'mc-local-share';

/**
 * NetMsg_QueryUserTitelInfo_CN
 * REQ = QueryUserTitelInfoReq
 * RES = {}
 * 注册：reqId=10370、recId=0
 */
export class NetMsg_QueryUserTitelInfo_CN extends MessageBase<QueryUserTitelInfoReq, {}> {
  /** 请求消息号：QUERY_USERTITLE_INFO_REQ (10370) */
  reqId: MESSAGE_ID = MESSAGE_ID.QUERY_USERTITLE_INFO_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: QueryUserTitelInfoReq): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_QueryUserTitelInfo_CN');
    }
    return resobj
  }
}
