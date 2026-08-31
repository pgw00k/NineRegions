// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_PVEDailyInfoReq

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  GetDailyPveInfoRequest,
} from 'mc-local-share';

/**
 * NetMsg_PVEDailyInfoReq
 * REQ = GetDailyPveInfoRequest
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=10135、recId=-1
 */
export class NetMsg_PVEDailyInfoReq implements IHandle<GetDailyPveInfoRequest, {}> {
  /** 请求消息号：GET_DAILYPVEINFO_REQ (10135) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.GET_DAILYPVEINFO_REQ;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: GetDailyPveInfoRequest): {} {
    throw new Error('Handle not implemented: NetMsg_PVEDailyInfoReq');
  }
}
