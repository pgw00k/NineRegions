// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_MainTownReconnect

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  LogicReconnectionResponse,
} from 'mc-local-share';

/**
 * NetMsg_MainTownReconnect
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = LogicReconnectionResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10012
 */
export class NetMsg_MainTownReconnect implements IHandle<PlayerInfoSimple, LogicReconnectionResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：LOGIC_RECONNECTION_REP (10012) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.LOGIC_RECONNECTION_REP;

  Handle(req: PlayerInfoSimple): LogicReconnectionResponse {
    throw new Error('Handle not implemented: NetMsg_MainTownReconnect');
  }
}
