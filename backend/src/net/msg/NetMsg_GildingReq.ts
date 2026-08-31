// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_GildingReq

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GildingRequest,
} from 'mc-local-share';

/**
 * NetMsg_GildingReq
 * REQ = GildingRequest
 * RES = {}
 * 注册：reqId=10430、recId=0
 */
export class NetMsg_GildingReq extends MessageBase<GildingRequest, {}> {
  /** 请求消息号：GILDING_REQ (10430) */
  reqId: MESSAGE_ID = MESSAGE_ID.GILDING_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: GildingRequest): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_GildingReq');
    }
    return resobj
  }
}
