// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Infi_SelClass

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  InfiSelectJobRequest,
  InfiSelectJobResponse,
} from 'mc-local-share';

/**
 * Infi_SelClass
 * REQ = InfiSelectJobRequest
 * RES = InfiSelectJobResponse
 * 注册：reqId=10082、recId=10083
 */
export class NetMsg_InfiSelClass implements IHandle<InfiSelectJobRequest, InfiSelectJobResponse> {
  /** 请求消息号：INFI_SELECT_JOB_REQ (10082) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_JOB_REQ;
  /** 响应消息号：INFI_SELECT_JOB_REP (10083) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_JOB_REP;

  Handle(req: InfiSelectJobRequest): InfiSelectJobResponse {
    throw new Error('Handle not implemented: Infi_SelClass');
  }
}
