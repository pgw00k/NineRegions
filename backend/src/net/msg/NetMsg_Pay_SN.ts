// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_Pay_SN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  PayResponse,
} from 'mc-local-share';

/**
 * NetMsg_Pay_SN
 * REQ = {}
 * RES = PayResponse
 * 注册：reqId=0、recId=10380
 */
export class NetMsg_Pay_SN extends MessageBase<{}, PayResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：PAY_REP (10380) */
  recId: MESSAGE_ID = MESSAGE_ID.PAY_REP;

  override Handle(req: {}): PayResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_Pay_SN');
    }
    return resobj
  }
}
