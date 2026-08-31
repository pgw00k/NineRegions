// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ActivityInfoRep_SN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetActitiviesResponse,
} from 'mc-local-share';

/**
 * NetMsg_ActivityInfoRep_SN
 * REQ = {}
 * RES = GetActitiviesResponse
 * 注册：reqId=0、recId=10205
 */
export class NetMsg_ActivityInfoRep_SN extends MessageBase<{}, GetActitiviesResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：GET_ACTIVITIES_REP (10205) */
  recId: MESSAGE_ID = MESSAGE_ID.GET_ACTIVITIES_REP;

  override Handle(req: {}): GetActitiviesResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_ActivityInfoRep_SN');
    }
    return resobj
  }
}
