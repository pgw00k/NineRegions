// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ActivityInfoReq_CN

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetActitiviesRequest,
} from 'mc-local-share';

/**
 * NetMsg_ActivityInfoReq_CN
 * REQ = GetActitiviesRequest
 * RES = {}
 * 注册：reqId=10204,recId=0
 */
export class NetMsg_ActivityInfoReq_CN extends MessageBase<GetActitiviesRequest, {}> {
  /** 请求消息号：GET_ACTIVITIES_REQ (10204) */
  reqId: MESSAGE_ID = MESSAGE_ID.GET_ACTIVITIES_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override HandleSync(req: GetActitiviesRequest, client?: Client): {} {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_ActivityInfoReq_CN');
    }
    return resobj
  }
}
