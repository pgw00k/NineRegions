// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_GetSimpleDataReq

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiGetSimpleDataRequest,
} from 'mc-local-share';

/**
 * Infi_GetSimpleDataReq
 * REQ = InfiGetSimpleDataRequest
 * RES = {}
 * 注册：reqId=10126、recId=0
 */
export class NetMsg_InfiGetSimpleDataReq extends MessageBase<InfiGetSimpleDataRequest, {}> {
  /** 请求消息号：INFI_GET_SIMPLE_DATA_REQ (10126) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_GET_SIMPLE_DATA_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: InfiGetSimpleDataRequest): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Infi_GetSimpleDataReq');
    }
    return resobj
  }
}
