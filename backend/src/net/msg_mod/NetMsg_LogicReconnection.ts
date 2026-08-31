import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  LogicReconnectionRequest,
  LogicReconnectionResponse,
  ErrorCode,
} from 'mc-local-share';

/**
 * NetMsg_Heartbeat
 * REQ = HeartbeatReq
 * RES = HeartbeatRep
 * 注册：reqId=10003、recId=10004
 */
export class NetMsg_LogicReconnection implements IHandle<LogicReconnectionRequest, LogicReconnectionResponse> {
  /** 请求消息号：LOGIC_RECONNECTION_REQ (10003) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.LOGIC_RECONNECTION_REQ;
  /** 响应消息号：LOGIC_RECONNECTION_REP (10004) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.LOGIC_RECONNECTION_REP;

  Handle(req: LogicReconnectionRequest): LogicReconnectionResponse {
    return {
      error: ErrorCode.SUCCESS,
      heroEquips: [],
      loginActivity: [],
      shopInfo: [],
      data: []
    };
  }
}
