// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Infi_GetSimpleDataReq

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  InfiGetSimpleDataRequest,
} from 'mc-local-share';

/**
 * Infi_GetSimpleDataReq
 * REQ = InfiGetSimpleDataRequest
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=10126、recId=-1
 */
export class NetMsg_InfiGetSimpleDataReq implements IHandle<InfiGetSimpleDataRequest, {}> {
  /** 请求消息号：INFI_GET_SIMPLE_DATA_REQ (10126) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.INFI_GET_SIMPLE_DATA_REQ;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: InfiGetSimpleDataRequest): {} {
    throw new Error('Handle not implemented: Infi_GetSimpleDataReq');
  }
}
