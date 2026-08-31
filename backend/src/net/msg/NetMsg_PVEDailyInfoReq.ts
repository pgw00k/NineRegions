// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_PVEDailyInfoReq

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetDailyPveInfoRequest,
} from 'mc-local-share';

/**
 * NetMsg_PVEDailyInfoReq
 * REQ = GetDailyPveInfoRequest
 * RES = {}
 * 注册：reqId=10135、recId=0
 */
export class NetMsg_PVEDailyInfoReq extends MessageBase<GetDailyPveInfoRequest, {}> {
  /** 请求消息号：GET_DAILYPVEINFO_REQ (10135) */
  reqId: MESSAGE_ID = MESSAGE_ID.GET_DAILYPVEINFO_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: GetDailyPveInfoRequest): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_PVEDailyInfoReq');
    }
    return resobj
  }
}
