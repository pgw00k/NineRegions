// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Msg_RecordDelete

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  DeleteRecordRequest,
  DeleteRecordResponse,
} from 'mc-local-share';

/**
 * Msg_RecordDelete
 * REQ = DeleteRecordRequest
 * RES = DeleteRecordResponse
 * 注册：reqId=10444、recId=10445
 */
export class NetMsg_RecordDelete implements IHandle<DeleteRecordRequest, DeleteRecordResponse> {
  /** 请求消息号：DELETE_RECORD_REQ (10444) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.DELETE_RECORD_REQ;
  /** 响应消息号：DELETE_RECORD_REP (10445) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.DELETE_RECORD_REP;

  Handle(req: DeleteRecordRequest): DeleteRecordResponse {
    throw new Error('Handle not implemented: Msg_RecordDelete');
  }
}
