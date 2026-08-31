// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_EnterReq

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiEnterRequest,
} from 'mc-local-share';

/**
 * Infi_EnterReq
 * REQ = InfiEnterRequest
 * RES = {}
 * 注册：reqId=10080、recId=0
 */
export class NetMsg_InfiEnterReq extends MessageBase<InfiEnterRequest, {}> {
  /** 请求消息号：INFI_ENTER_REQ (10080) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_ENTER_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: InfiEnterRequest): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Infi_EnterReq');
    }
    return resobj
  }
}
