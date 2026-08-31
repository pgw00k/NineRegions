// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_CN_Heartbeat

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  HeartbeatReq,
} from 'mc-local-share';

/**
 * NetMsg_CN_Heartbeat
 * REQ = HeartbeatReq
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=10003、recId=-1
 */
export class NetMsg_Heartbeat_CN implements IHandle<HeartbeatReq, {}> {
  /** 请求消息号：HEARTBEAT_REQ (10003) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.HEARTBEAT_REQ;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: HeartbeatReq): {} {
    throw new Error('Handle not implemented: NetMsg_CN_Heartbeat');
  }
}
