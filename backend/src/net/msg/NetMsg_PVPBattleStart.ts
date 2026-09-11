// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: PVPBattleStart

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  BattleStartResponse,
} from 'mc-local-share';

/**
 * PVPBattleStart
 * REQ = {}
 * RES = BattleStartResponse
 * 注册：reqId=0,recId=25002
 */
export class NetMsg_PVPBattleStart extends MessageBase<{}, BattleStartResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：BATTLE_START_REP (25002) */
  recId: MESSAGE_ID = MESSAGE_ID.BATTLE_START_REP;

  override HandleSync(req: {}, client?: Client, uid?: string, token?: string,exData?:any): BattleStartResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: PVPBattleStart');
    }
    return resobj
  }
}
