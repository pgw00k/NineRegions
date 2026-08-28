// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_FixPay_CN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  QueryFailChargeOrderIDReq,
} from 'mc-local-share';

/**
 * NetMsg_FixPay_CN
 * REQ = QueryFailChargeOrderIDReq
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=10385、recId=-1
 */
export class NetMsg_FixPay_CN implements IHandle<QueryFailChargeOrderIDReq, {}> {
  /** 请求消息号：QUERY_FAIL_CHARGE_ORDERID_REQ (10385) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.QUERY_FAIL_CHARGE_ORDERID_REQ;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: QueryFailChargeOrderIDReq): {} {
    throw new Error('Handle not implemented: NetMsg_FixPay_CN');
  }
}
