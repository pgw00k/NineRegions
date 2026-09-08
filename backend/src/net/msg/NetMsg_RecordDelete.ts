// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Msg_RecordDelete

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  DeleteRecordRequest,
  DeleteRecordResponse,
} from 'mc-local-share';

/**
 * Msg_RecordDelete
 * REQ = DeleteRecordRequest
 * RES = DeleteRecordResponse
 * 注册：reqId=10444,recId=10445
 */
export class NetMsg_RecordDelete extends MessageBase<DeleteRecordRequest, DeleteRecordResponse> {
  /** 请求消息号：DELETE_RECORD_REQ (10444) */
  reqId: MESSAGE_ID = MESSAGE_ID.DELETE_RECORD_REQ;
  /** 响应消息号：DELETE_RECORD_REP (10445) */
  recId: MESSAGE_ID = MESSAGE_ID.DELETE_RECORD_REP;

  override HandleSync(req: DeleteRecordRequest, client?: Client): DeleteRecordResponse {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: Msg_RecordDelete');
    }
    return resobj
  }
}
