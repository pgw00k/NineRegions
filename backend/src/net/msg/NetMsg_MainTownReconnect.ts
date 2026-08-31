// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_MainTownReconnect

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  LogicReconnectionResponse,
} from 'mc-local-share';

/**
 * NetMsg_MainTownReconnect
 * REQ = {}
 * RES = LogicReconnectionResponse
 * 注册：reqId=0、recId=10012
 */
export class NetMsg_MainTownReconnect extends MessageBase<{}, LogicReconnectionResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：LOGIC_RECONNECTION_REP (10012) */
  recId: MESSAGE_ID = MESSAGE_ID.LOGIC_RECONNECTION_REP;

  override Handle(req: {}): LogicReconnectionResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_MainTownReconnect');
    }
    return resobj
  }
}
