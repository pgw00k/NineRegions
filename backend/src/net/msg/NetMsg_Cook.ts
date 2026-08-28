// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMag_Cook

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  CookRequest,
  CookResponse,
} from 'mc-local-share';

/**
 * NetMag_Cook
 * REQ = CookRequest
 * RES = CookResponse
 * 注册：reqId=10302、recId=10303
 */
export class NetMsg_Cook implements IHandle<CookRequest, CookResponse> {
  /** 请求消息号：COOK_REQ (10302) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.COOK_REQ;
  /** 响应消息号：COOK_REP (10303) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.COOK_REP;

  Handle(req: CookRequest): CookResponse {
    throw new Error('Handle not implemented: NetMag_Cook');
  }
}
