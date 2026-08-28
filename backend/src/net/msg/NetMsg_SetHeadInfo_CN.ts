// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_SetHeadInfo_CN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  SetHeadInfoReq,
} from 'mc-local-share';

/**
 * NetMsg_SetHeadInfo_CN
 * REQ = SetHeadInfoReq
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=10376、recId=-1
 */
export class NetMsg_SetHeadInfo_CN implements IHandle<SetHeadInfoReq, {}> {
  /** 请求消息号：SET_HEAD_INFO_REQ (10376) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.SET_HEAD_INFO_REQ;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: SetHeadInfoReq): {} {
    throw new Error('Handle not implemented: NetMsg_SetHeadInfo_CN');
  }
}
