// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_GetGiftInfo_CN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  GetGiftInfoRequest,
} from 'mc-local-share';

/**
 * NetMsg_GetGiftInfo_CN
 * REQ = GetGiftInfoRequest
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=10022、recId=-1
 */
export class NetMsg_GetGiftInfo_CN implements IHandle<GetGiftInfoRequest, {}> {
  /** 请求消息号：GET_GIFTINFO_REQ (10022) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.GET_GIFTINFO_REQ;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: GetGiftInfoRequest): {} {
    throw new Error('Handle not implemented: NetMsg_GetGiftInfo_CN');
  }
}
