// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: BattleEnd

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  BattleEndResponse,
} from 'mc-local-share';

/**
 * BattleEnd
 * REQ = {}
 * RES = BattleEndResponse
 * 注册：reqId=0,recId=25008
 */
export class NetMsg_BattleEnd extends MessageBase<{}, BattleEndResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：BATTLE_END_REP (25008) */
  recId: MESSAGE_ID = MESSAGE_ID.BATTLE_END_REP;

  override HandleSync(req: {}, client?: Client, uid?: string, token?: string,exData?:any): BattleEndResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: BattleEnd');
    }
    return resobj
  }
}
