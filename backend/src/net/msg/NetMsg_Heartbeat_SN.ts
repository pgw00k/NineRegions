// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_SN_Heartbeat

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  HeartbeatRep,
} from 'mc-local-share';

/**
 * NetMsg_SN_Heartbeat
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = HeartbeatRep
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10004
 */
export class NetMsg_Heartbeat_SN implements IHandle<PlayerInfoSimple, HeartbeatRep> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：HEARTBEAT_REP (10004) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.HEARTBEAT_REP;

  Handle(req: PlayerInfoSimple): HeartbeatRep {
    throw new Error('Handle not implemented: NetMsg_SN_Heartbeat');
  }
}
