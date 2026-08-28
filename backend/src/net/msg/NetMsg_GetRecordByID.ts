// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Msg_GetSingleRecByID

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  GetRecordInfoRequest,
  GetRecordInfoResponse,
} from 'mc-local-share';

/**
 * Msg_GetSingleRecByID
 * REQ = GetRecordInfoRequest
 * RES = GetRecordInfoResponse
 * 注册：reqId=10446、recId=10447
 */
export class NetMsg_GetRecordByID implements IHandle<GetRecordInfoRequest, GetRecordInfoResponse> {
  /** 请求消息号：GET_RECORDINFO_REQ (10446) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.GET_RECORDINFO_REQ;
  /** 响应消息号：GET_RECORDINFO_REP (10447) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GET_RECORDINFO_REP;

  Handle(req: GetRecordInfoRequest): GetRecordInfoResponse {
    throw new Error('Handle not implemented: Msg_GetSingleRecByID');
  }
}
