// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMag_Cook

import { MessageBase } from '../MessageBase';
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
export class NetMsg_Cook extends MessageBase<CookRequest, CookResponse> {
  /** 请求消息号：COOK_REQ (10302) */
  reqId: MESSAGE_ID = MESSAGE_ID.COOK_REQ;
  /** 响应消息号：COOK_REP (10303) */
  recId: MESSAGE_ID = MESSAGE_ID.COOK_REP;

  override Handle(req: CookRequest): CookResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMag_Cook');
    }
    return resobj
  }
}
