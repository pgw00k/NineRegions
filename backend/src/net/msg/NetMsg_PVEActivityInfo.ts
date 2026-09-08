// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_PVEActivityInfo

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetActivityPveInfoReq,
  GetActivityPveInfoRsp,
} from 'mc-local-share';

/**
 * NetMsg_PVEActivityInfo
 * REQ = GetActivityPveInfoReq
 * RES = GetActivityPveInfoRsp
 * 注册：reqId=10137,recId=10138
 */
export class NetMsg_PVEActivityInfo extends MessageBase<GetActivityPveInfoReq, GetActivityPveInfoRsp> {
  /** 请求消息号：GET_ACTIVITY_PVE_INFO_REQ (10137) */
  reqId: MESSAGE_ID = MESSAGE_ID.GET_ACTIVITY_PVE_INFO_REQ;
  /** 响应消息号：GET_ACTIVITY_PVE_INFO_RSP (10138) */
  recId: MESSAGE_ID = MESSAGE_ID.GET_ACTIVITY_PVE_INFO_RSP;

  override HandleSync(req: GetActivityPveInfoReq, client?: Client): GetActivityPveInfoRsp {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_PVEActivityInfo');
    }
    return resobj
  }
}
