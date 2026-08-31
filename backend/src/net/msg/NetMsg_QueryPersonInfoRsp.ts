// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_QueryPersonInfoRsp

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  QueryPersonalInfoRsp,
} from 'mc-local-share';

/**
 * NetMsg_QueryPersonInfoRsp
 * REQ = {}
 * RES = QueryPersonalInfoRsp
 * 注册：reqId=0、recId=10349
 */
export class NetMsg_QueryPersonInfoRsp extends MessageBase<{}, QueryPersonalInfoRsp> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：QUERY_PERSONAL_INFO_RSP (10349) */
  recId: MESSAGE_ID = MESSAGE_ID.QUERY_PERSONAL_INFO_RSP;

  override Handle(req: {}): QueryPersonalInfoRsp {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_QueryPersonInfoRsp');
    }
    return resobj
  }
}
