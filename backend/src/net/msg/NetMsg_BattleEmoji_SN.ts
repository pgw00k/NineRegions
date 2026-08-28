// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_BattleEmojiRsp

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  BattleEmojiResponse,
} from 'mc-local-share';

/**
 * NetMsg_BattleEmojiRsp
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = BattleEmojiResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=25017
 */
export class NetMsg_BattleEmoji_SN implements IHandle<PlayerInfoSimple, BattleEmojiResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：BATTLE_EMOJI_REP (25017) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.BATTLE_EMOJI_REP;

  Handle(req: PlayerInfoSimple): BattleEmojiResponse {
    throw new Error('Handle not implemented: NetMsg_BattleEmojiRsp');
  }
}
