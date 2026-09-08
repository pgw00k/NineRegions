// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_BattleEmojiRsp

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  BattleEmojiResponse,
} from 'mc-local-share';

/**
 * NetMsg_BattleEmojiRsp
 * REQ = {}
 * RES = BattleEmojiResponse
 * 注册：reqId=0,recId=25017
 */
export class NetMsg_BattleEmoji_SN extends MessageBase<{}, BattleEmojiResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：BATTLE_EMOJI_REP (25017) */
  recId: MESSAGE_ID = MESSAGE_ID.BATTLE_EMOJI_REP;

  override HandleSync(req: {}, client?: Client): BattleEmojiResponse {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_BattleEmojiRsp');
    }
    return resobj
  }
}
