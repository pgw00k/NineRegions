// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_FixPay_SN

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  QueryFailChargeOrderIDRsp,
} from 'mc-local-share';

/**
 * NetMsg_FixPay_SN
 * REQ = {}
 * RES = QueryFailChargeOrderIDRsp
 * 注册：reqId=0,recId=10386
 */
export class NetMsg_FixPay_SN extends MessageBase<{}, QueryFailChargeOrderIDRsp> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：QUERY_FAIL_CHARGE_ORDERID_RSP (10386) */
  recId: MESSAGE_ID = MESSAGE_ID.QUERY_FAIL_CHARGE_ORDERID_RSP;

  override HandleSync(req: {}, client?: Client): QueryFailChargeOrderIDRsp {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_FixPay_SN');
    }
    return resobj
  }
}
