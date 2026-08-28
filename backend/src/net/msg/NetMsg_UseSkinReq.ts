// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_UseSkin

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  UseSkinReq,
} from 'mc-local-share';

/**
 * NetMsg_UseSkin
 * REQ = UseSkinReq
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=10394、recId=-1
 */
export class NetMsg_UseSkinReq implements IHandle<UseSkinReq, {}> {
  /** 请求消息号：USE_SKIN_REQ (10394) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.USE_SKIN_REQ;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: UseSkinReq): {} {
    throw new Error('Handle not implemented: NetMsg_UseSkin');
  }
}
