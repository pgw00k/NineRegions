import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  HeartbeatReq,
  HeartbeatRep,
} from 'mc-local-share';

/**
 * NetMsg_Heartbeat
 * REQ = HeartbeatReq
 * RES = HeartbeatRep
 * 注册：reqId=10003、recId=10004
 */
export class NetMsg_Heartbeat implements IHandle<HeartbeatReq, HeartbeatRep> {
  /** 请求消息号：HEARTBEAT_REQ (10003) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.HEARTBEAT_REQ;
  /** 响应消息号：HEARTBEAT_REP (10004) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.HEARTBEAT_REP;

  Handle(req: HeartbeatReq): HeartbeatRep {
    return {
      timestamp: {
      },
      moduleFlags: [],
    };
  }
}
