// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Msg_PlayRecByID

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetRecordDataRequest,
  GetRecordDataResponse,
} from 'mc-local-share';

/**
 * Msg_PlayRecByID
 * REQ = GetRecordDataRequest
 * RES = GetRecordDataResponse
 * 注册：reqId=10448,recId=10449
 */
export class NetMsg_RecordPlay extends MessageBase<GetRecordDataRequest, GetRecordDataResponse> {
  /** 请求消息号：GET_RECORDDATA_REQ (10448) */
  reqId: MESSAGE_ID = MESSAGE_ID.GET_RECORDDATA_REQ;
  /** 响应消息号：GET_RECORDDATA_REP (10449) */
  recId: MESSAGE_ID = MESSAGE_ID.GET_RECORDDATA_REP;

  override HandleSync(req: GetRecordDataRequest, client?: Client): GetRecordDataResponse {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: Msg_PlayRecByID');
    }
    return resobj
  }
}
