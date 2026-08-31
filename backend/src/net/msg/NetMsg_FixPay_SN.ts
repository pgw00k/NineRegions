// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_FixPay_SN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  QueryFailChargeOrderIDRsp,
} from 'mc-local-share';

/**
 * NetMsg_FixPay_SN
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = QueryFailChargeOrderIDRsp
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10386
 */
export class NetMsg_FixPay_SN implements IHandle<PlayerInfoSimple, QueryFailChargeOrderIDRsp> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：QUERY_FAIL_CHARGE_ORDERID_RSP (10386) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.QUERY_FAIL_CHARGE_ORDERID_RSP;

  Handle(req: PlayerInfoSimple): QueryFailChargeOrderIDRsp {
    throw new Error('Handle not implemented: NetMsg_FixPay_SN');
  }
}
