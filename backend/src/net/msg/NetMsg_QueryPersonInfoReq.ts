// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_QueryPersonInfoReq

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  QueryPersonalInfoReq,
} from 'mc-local-share';

/**
 * NetMsg_QueryPersonInfoReq
 * REQ = QueryPersonalInfoReq
 * RES = {}
 * 注册：reqId=10348、recId=0
 */
export class NetMsg_QueryPersonInfoReq extends MessageBase<QueryPersonalInfoReq, {}> {
  /** 请求消息号：QUERY_PERSONAL_INFO_REQ (10348) */
  reqId: MESSAGE_ID = MESSAGE_ID.QUERY_PERSONAL_INFO_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: QueryPersonalInfoReq): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_QueryPersonInfoReq');
    }
    return resobj
  }
}
