// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_SelClass

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiSelectJobRequest,
  InfiSelectJobResponse,
} from 'mc-local-share';

/**
 * Infi_SelClass
 * REQ = InfiSelectJobRequest
 * RES = InfiSelectJobResponse
 * 注册：reqId=10082,recId=10083
 */
export class NetMsg_InfiSelClass extends MessageBase<InfiSelectJobRequest, InfiSelectJobResponse> {
  /** 请求消息号：INFI_SELECT_JOB_REQ (10082) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_JOB_REQ;
  /** 响应消息号：INFI_SELECT_JOB_REP (10083) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_JOB_REP;

  override HandleSync(req: InfiSelectJobRequest, client?: Client, uid?: string, token?: string,exData?:any): InfiSelectJobResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: Infi_SelClass');
    }
    return resobj
  }
}
