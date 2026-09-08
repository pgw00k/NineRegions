// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_QueryUserTitelInfo_SN

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  QueryUserTitelInfoRsp,
} from 'mc-local-share';

/**
 * NetMsg_QueryUserTitelInfo_SN
 * REQ = {}
 * RES = QueryUserTitelInfoRsp
 * 注册：reqId=0,recId=10371
 */
export class NetMsg_QueryUserTitelInfo_SN extends MessageBase<{}, QueryUserTitelInfoRsp> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：QUERY_USERTITLE_INFO_RSP (10371) */
  recId: MESSAGE_ID = MESSAGE_ID.QUERY_USERTITLE_INFO_RSP;

  override HandleSync(req: {}, client?: Client, uid?: string, token?: string,exData?:any): QueryUserTitelInfoRsp {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_QueryUserTitelInfo_SN');
    }
    return resobj
  }
}
