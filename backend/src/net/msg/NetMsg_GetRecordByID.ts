// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Msg_GetSingleRecByID

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetRecordInfoRequest,
  GetRecordInfoResponse,
} from 'mc-local-share';

/**
 * Msg_GetSingleRecByID
 * REQ = GetRecordInfoRequest
 * RES = GetRecordInfoResponse
 * 注册：reqId=10446,recId=10447
 */
export class NetMsg_GetRecordByID extends MessageBase<GetRecordInfoRequest, GetRecordInfoResponse> {
  /** 请求消息号：GET_RECORDINFO_REQ (10446) */
  reqId: MESSAGE_ID = MESSAGE_ID.GET_RECORDINFO_REQ;
  /** 响应消息号：GET_RECORDINFO_REP (10447) */
  recId: MESSAGE_ID = MESSAGE_ID.GET_RECORDINFO_REP;

  override HandleSync(req: GetRecordInfoRequest, client?: Client): GetRecordInfoResponse {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: Msg_GetSingleRecByID');
    }
    return resobj
  }
}
