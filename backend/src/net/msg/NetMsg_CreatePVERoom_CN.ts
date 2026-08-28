// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_CreatePVERoom

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  CreatePVERoomRequest,
} from 'mc-local-share';

/**
 * NetMsg_CreatePVERoom
 * REQ = CreatePVERoomRequest
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=10009、recId=-1
 */
export class NetMsg_CreatePVERoom_CN implements IHandle<CreatePVERoomRequest, {}> {
  /** 请求消息号：CREATE_PVEROOM_REQ (10009) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.CREATE_PVEROOM_REQ;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: CreatePVERoomRequest): {} {
    throw new Error('Handle not implemented: NetMsg_CreatePVERoom');
  }
}
