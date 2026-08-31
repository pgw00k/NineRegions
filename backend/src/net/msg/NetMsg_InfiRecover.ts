// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_Recover

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiRecoverRequest,
  InfiRecoverResponse,
} from 'mc-local-share';

/**
 * Infi_Recover
 * REQ = InfiRecoverRequest
 * RES = InfiRecoverResponse
 * 注册：reqId=10099、recId=10100
 */
export class NetMsg_InfiRecover extends MessageBase<InfiRecoverRequest, InfiRecoverResponse> {
  /** 请求消息号：INFI_RECOVER_REQ (10099) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_RECOVER_REQ;
  /** 响应消息号：INFI_RECOVER_REP (10100) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_RECOVER_REP;

  override Handle(req: InfiRecoverRequest): InfiRecoverResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Infi_Recover');
    }
    return resobj
  }
}
