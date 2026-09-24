// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_BattleReconnection

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  BattleReconnectionRequest,
  BattleReconnectionResponse,
} from 'mc-local-share';

/**
 * NetMsg_BattleReconnection
 * REQ = BattleReconnectionRequest
 * RES = BattleReconnectionResponse
 * 注册：reqId=20001,recId=20002
 */
export class NetMsg_BattleReconnection extends MessageBase<BattleReconnectionRequest, BattleReconnectionResponse> {
  /** 请求消息号：BATTLE_RECONNECTION_REQ (20001) */
  reqId: MESSAGE_ID = MESSAGE_ID.BATTLE_RECONNECTION_REQ;
  /** 响应消息号：BATTLE_RECONNECTION_REP (20002) */
  recId: MESSAGE_ID = MESSAGE_ID.BATTLE_RECONNECTION_REP;

  override HandleSync(req: BattleReconnectionRequest, client?: Client, uid?: string, token?: string,exData?:any): BattleReconnectionResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_BattleReconnection');
    }
    return resobj
  }
}
