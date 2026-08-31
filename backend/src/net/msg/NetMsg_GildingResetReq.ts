// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_GildingResetReq

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  GildingResetRequest,
} from 'mc-local-share';

/**
 * NetMsg_GildingResetReq
 * REQ = GildingResetRequest
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=10432、recId=-1
 */
export class NetMsg_GildingResetReq implements IHandle<GildingResetRequest, {}> {
  /** 请求消息号：GILDING_RESET_REQ (10432) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.GILDING_RESET_REQ;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: GildingResetRequest): {} {
    throw new Error('Handle not implemented: NetMsg_GildingResetReq');
  }
}
