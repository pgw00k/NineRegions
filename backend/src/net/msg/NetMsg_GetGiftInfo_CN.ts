// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_GetGiftInfo_CN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetGiftInfoRequest,
} from 'mc-local-share';

/**
 * NetMsg_GetGiftInfo_CN
 * REQ = GetGiftInfoRequest
 * RES = {}
 * 注册：reqId=10022、recId=0
 */
export class NetMsg_GetGiftInfo_CN extends MessageBase<GetGiftInfoRequest, {}> {
  /** 请求消息号：GET_GIFTINFO_REQ (10022) */
  reqId: MESSAGE_ID = MESSAGE_ID.GET_GIFTINFO_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: GetGiftInfoRequest): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_GetGiftInfo_CN');
    }
    return resobj
  }
}
