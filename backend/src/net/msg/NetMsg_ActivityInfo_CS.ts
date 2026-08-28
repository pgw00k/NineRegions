// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ActivityInfo_CS

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  GetActitiviesRequest,
  GetActitiviesResponse,
} from 'mc-local-share';

/**
 * NetMsg_ActivityInfo_CS
 * REQ = GetActitiviesRequest
 * RES = GetActitiviesResponse
 * 注册：reqId=10204、recId=10205
 */
export class NetMsg_ActivityInfo_CS implements IHandle<GetActitiviesRequest, GetActitiviesResponse> {
  /** 请求消息号：GET_ACTIVITIES_REQ (10204) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.GET_ACTIVITIES_REQ;
  /** 响应消息号：GET_ACTIVITIES_REP (10205) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GET_ACTIVITIES_REP;

  Handle(req: GetActitiviesRequest): GetActitiviesResponse {
    throw new Error('Handle not implemented: NetMsg_ActivityInfo_CS');
  }
}
