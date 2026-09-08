// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Msg_GetRecordInfo

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetRecordListRequest,
  GetRecordListResponse,
} from 'mc-local-share';

/**
 * Msg_GetRecordInfo
 * REQ = GetRecordListRequest
 * RES = GetRecordListResponse
 * 注册：reqId=10440,recId=10441
 */
export class NetMsg_GetRecordInfo extends MessageBase<GetRecordListRequest, GetRecordListResponse> {
  /** 请求消息号：GET_RECORDLIST_REQ (10440) */
  reqId: MESSAGE_ID = MESSAGE_ID.GET_RECORDLIST_REQ;
  /** 响应消息号：GET_RECORDLIST_REP (10441) */
  recId: MESSAGE_ID = MESSAGE_ID.GET_RECORDLIST_REP;

  override HandleSync(req: GetRecordListRequest, client?: Client): GetRecordListResponse {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: Msg_GetRecordInfo');
    }
    return resobj
  }
}
