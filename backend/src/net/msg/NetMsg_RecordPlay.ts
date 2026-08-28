// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Msg_PlayRecByID

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  GetRecordDataRequest,
  GetRecordDataResponse,
} from 'mc-local-share';

/**
 * Msg_PlayRecByID
 * REQ = GetRecordDataRequest
 * RES = GetRecordDataResponse
 * 注册：reqId=10448、recId=10449
 */
export class NetMsg_RecordPlay implements IHandle<GetRecordDataRequest, GetRecordDataResponse> {
  /** 请求消息号：GET_RECORDDATA_REQ (10448) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.GET_RECORDDATA_REQ;
  /** 响应消息号：GET_RECORDDATA_REP (10449) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GET_RECORDDATA_REP;

  Handle(req: GetRecordDataRequest): GetRecordDataResponse {
    throw new Error('Handle not implemented: Msg_PlayRecByID');
  }
}
