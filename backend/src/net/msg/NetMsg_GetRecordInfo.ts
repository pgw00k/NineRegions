// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Msg_GetRecordInfo

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  GetRecordListRequest,
  GetRecordListResponse,
} from 'mc-local-share';

/**
 * Msg_GetRecordInfo
 * REQ = GetRecordListRequest
 * RES = GetRecordListResponse
 * 注册：reqId=10440、recId=10441
 */
export class NetMsg_GetRecordInfo implements IHandle<GetRecordListRequest, GetRecordListResponse> {
  /** 请求消息号：GET_RECORDLIST_REQ (10440) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.GET_RECORDLIST_REQ;
  /** 响应消息号：GET_RECORDLIST_REP (10441) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GET_RECORDLIST_REP;

  Handle(req: GetRecordListRequest): GetRecordListResponse {
    throw new Error('Handle not implemented: Msg_GetRecordInfo');
  }
}
