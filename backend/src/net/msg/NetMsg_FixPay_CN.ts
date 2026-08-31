// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_FixPay_CN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  QueryFailChargeOrderIDReq,
} from 'mc-local-share';

/**
 * NetMsg_FixPay_CN
 * REQ = QueryFailChargeOrderIDReq
 * RES = {}
 * 注册：reqId=10385、recId=0
 */
export class NetMsg_FixPay_CN extends MessageBase<QueryFailChargeOrderIDReq, {}> {
  /** 请求消息号：QUERY_FAIL_CHARGE_ORDERID_REQ (10385) */
  reqId: MESSAGE_ID = MESSAGE_ID.QUERY_FAIL_CHARGE_ORDERID_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: QueryFailChargeOrderIDReq): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_FixPay_CN');
    }
    return resobj
  }
}
