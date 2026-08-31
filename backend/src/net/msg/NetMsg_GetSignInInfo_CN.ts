// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_GetSignInInfo_CN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  GetSignInInfoRequest,
} from 'mc-local-share';

/**
 * NetMsg_GetSignInInfo_CN
 * REQ = GetSignInInfoRequest
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=10202、recId=-1
 */
export class NetMsg_GetSignInInfo_CN implements IHandle<GetSignInInfoRequest, {}> {
  /** 请求消息号：GET_SIGNIN_INFO_REQ (10202) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.GET_SIGNIN_INFO_REQ;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: GetSignInInfoRequest): {} {
    throw new Error('Handle not implemented: NetMsg_GetSignInInfo_CN');
  }
}
