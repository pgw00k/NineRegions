// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_GetGiftInfo_SN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetGiftInfoResponse,
} from 'mc-local-share';

/**
 * NetMsg_GetGiftInfo_SN
 * REQ = {}
 * RES = GetGiftInfoResponse
 * 注册：reqId=0、recId=10023
 */
export class NetMsg_GetGiftInfo_SN extends MessageBase<{}, GetGiftInfoResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：GET_GIFTINFO_REP (10023) */
  recId: MESSAGE_ID = MESSAGE_ID.GET_GIFTINFO_REP;

  override Handle(req: {}): GetGiftInfoResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_GetGiftInfo_SN');
    }
    return resobj
  }
}
