// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_PVEDailyInfoRep

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetDailyPveInfoResponse,
} from 'mc-local-share';

/**
 * NetMsg_PVEDailyInfoRep
 * REQ = {}
 * RES = GetDailyPveInfoResponse
 * 注册：reqId=0,recId=10136
 */
export class NetMsg_PVEDailyInfoRep extends MessageBase<{}, GetDailyPveInfoResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：GET_DAILYPVEINFO_REP (10136) */
  recId: MESSAGE_ID = MESSAGE_ID.GET_DAILYPVEINFO_REP;

  override HandleSync(req: {}, client?: Client, uid?: string, token?: string,exData?:any): GetDailyPveInfoResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_PVEDailyInfoRep');
    }
    return resobj
  }
}
