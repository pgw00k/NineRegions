// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ChangeDefaultCardBack

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ChangeDefaultCardBackRequest,
  ChangeDefaultCardBackResponse,
} from 'mc-local-share';

/**
 * NetMsg_ChangeDefaultCardBack
 * REQ = ChangeDefaultCardBackRequest
 * RES = ChangeDefaultCardBackResponse
 * 注册：reqId=10131、recId=10132
 */
export class NetMsg_ChangeDefaultCardBack extends MessageBase<ChangeDefaultCardBackRequest, ChangeDefaultCardBackResponse> {
  /** 请求消息号：CHANGE_DEFAULT_CARDBACK_REQ (10131) */
  reqId: MESSAGE_ID = MESSAGE_ID.CHANGE_DEFAULT_CARDBACK_REQ;
  /** 响应消息号：CHANGE_DEFAULT_CARDBACK_REP (10132) */
  recId: MESSAGE_ID = MESSAGE_ID.CHANGE_DEFAULT_CARDBACK_REP;

  override Handle(req: ChangeDefaultCardBackRequest): ChangeDefaultCardBackResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_ChangeDefaultCardBack');
    }
    return resobj
  }
}
