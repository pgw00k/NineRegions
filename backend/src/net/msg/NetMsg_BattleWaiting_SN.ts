// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_SN_BattleWaiting

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  PushBattleWaiting,
} from 'mc-local-share';

/**
 * NetMsg_SN_BattleWaiting
 * REQ = {}
 * RES = PushBattleWaiting
 * 注册：reqId=0,recId=25015
 */
export class NetMsg_BattleWaiting_SN extends MessageBase<{}, PushBattleWaiting> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：PUSH_BATTLEWAITING (25015) */
  recId: MESSAGE_ID = MESSAGE_ID.PUSH_BATTLEWAITING;

  override HandleSync(req: {}, client?: Client, uid?: string, token?: string,exData?:any): PushBattleWaiting {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_SN_BattleWaiting');
    }
    return resobj
  }
}
