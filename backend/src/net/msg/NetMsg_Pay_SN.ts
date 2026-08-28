// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_Pay_SN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  PayResponse,
} from 'mc-local-share';

/**
 * NetMsg_Pay_SN
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = PayResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10380
 */
export class NetMsg_Pay_SN implements IHandle<PlayerInfoSimple, PayResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：PAY_REP (10380) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.PAY_REP;

  Handle(req: PlayerInfoSimple): PayResponse {
    throw new Error('Handle not implemented: NetMsg_Pay_SN');
  }
}
