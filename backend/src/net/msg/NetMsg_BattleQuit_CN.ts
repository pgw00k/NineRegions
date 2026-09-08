// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_BattleQuit

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
} from 'mc-local-share';

/**
 * NetMsg_BattleQuit
 * REQ = {}
 * RES = {}
 * 注册：reqId=25009,recId=0
 */
export class NetMsg_BattleQuit_CN extends MessageBase<{}, {}> {
  /** 请求消息号：QUIT_BATTLE_REQ (25009) */
  reqId: MESSAGE_ID = MESSAGE_ID.QUIT_BATTLE_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override HandleSync(req: {}, client?: Client, uid?: string, token?: string,exData?:any): {} {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_BattleQuit');
    }
    return resobj
  }
}
