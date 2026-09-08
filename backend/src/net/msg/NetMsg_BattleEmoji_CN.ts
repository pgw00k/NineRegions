// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_BattleEmojiReq

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  BattleEmojiRequest,
} from 'mc-local-share';

/**
 * NetMsg_BattleEmojiReq
 * REQ = BattleEmojiRequest
 * RES = {}
 * 注册：reqId=25016,recId=0
 */
export class NetMsg_BattleEmoji_CN extends MessageBase<BattleEmojiRequest, {}> {
  /** 请求消息号：BATTLE_EMOJI_REQ (25016) */
  reqId: MESSAGE_ID = MESSAGE_ID.BATTLE_EMOJI_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override HandleSync(req: BattleEmojiRequest, client?: Client, uid?: string, token?: string,exData?:any): {} {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_BattleEmojiReq');
    }
    return resobj
  }
}
