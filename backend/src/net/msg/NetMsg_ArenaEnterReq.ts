// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ArenaEnterReq

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  ArenaEnterRequest,
} from 'mc-local-share';

/**
 * NetMsg_ArenaEnterReq
 * REQ = ArenaEnterRequest
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=10060、recId=-1
 */
export class NetMsg_ArenaEnterReq implements IHandle<ArenaEnterRequest, {}> {
  /** 请求消息号：ARENA_ENTER_REQ (10060) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.ARENA_ENTER_REQ;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: ArenaEnterRequest): {} {
    throw new Error('Handle not implemented: NetMsg_ArenaEnterReq');
  }
}
