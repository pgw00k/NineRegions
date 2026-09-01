// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_EnterGame

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  LogicReconnectionRequest,
  LogicReconnectionResponse,
} from 'mc-local-share';

import { Logger } from '../../core/Logger';
import { Client } from '../Client';

/**
 * NetMsg_LogicReconnection_Mod
 * REQ = LogicReconnectionRequest
 * RES = LogicReconnectionResponse
 * 注册：reqId=10011,recId=10012
 */
export class NetMsg_LogicReconnection_Mod extends MessageBase<LogicReconnectionRequest, LogicReconnectionResponse> {

  recId: MESSAGE_ID = MESSAGE_ID.LOGIC_RECONNECTION_REP;
  reqId: MESSAGE_ID = MESSAGE_ID.LOGIC_RECONNECTION_REQ;

  override Handle(req: LogicReconnectionRequest, client?: Client): LogicReconnectionResponse {
    Logger.LogInfo('LogicReconnection_Mod.Handle', client ? { ...req, uid: client.uid } : req);
    return super.Handle(req);
  }
}
