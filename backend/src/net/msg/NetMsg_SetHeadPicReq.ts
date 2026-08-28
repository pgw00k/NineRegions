// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_SetHeadPicReq

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  SetHeadPicReq,
} from 'mc-local-share';

/**
 * NetMsg_SetHeadPicReq
 * REQ = SetHeadPicReq
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=10344、recId=-1
 */
export class NetMsg_SetHeadPicReq implements IHandle<SetHeadPicReq, {}> {
  /** 请求消息号：SET_HEAD_PIC_REQ (10344) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.SET_HEAD_PIC_REQ;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: SetHeadPicReq): {} {
    throw new Error('Handle not implemented: NetMsg_SetHeadPicReq');
  }
}
