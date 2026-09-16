// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: FightStart

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  FightStartResponse,
} from 'mc-local-share';

/**
 * FightStart
 * REQ = {}
 * RES = FightStartResponse
 * 注册：reqId=0,recId=25007
 */
export class NetMsg_FightStart extends MessageBase<{}, FightStartResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：FIGHT_START_REP (25007) */
  recId: MESSAGE_ID = MESSAGE_ID.FIGHT_START_REP;

  override HandleSync(req: {}, client?: Client, uid?: string, token?: string,exData?:any): FightStartResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: FightStart');
    }
    return resobj
  }
}
