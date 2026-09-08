// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: PVPMatch_CN_BattleReady

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  BattleReadyRequest,
} from 'mc-local-share';

/**
 * PVPMatch_CN_BattleReady
 * REQ = BattleReadyRequest
 * RES = {}
 * 注册：reqId=25001,recId=0
 */
export class NetMsg_BattleReady_CN extends MessageBase<BattleReadyRequest, {}> {
  /** 请求消息号：BATTLE_READY_REQ (25001) */
  reqId: MESSAGE_ID = MESSAGE_ID.BATTLE_READY_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override HandleSync(req: BattleReadyRequest, client?: Client): {} {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: PVPMatch_CN_BattleReady');
    }
    return resobj
  }
}
