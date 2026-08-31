// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_BattleEmojiReq

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  BattleEmojiRequest,
} from 'mc-local-share';

/**
 * NetMsg_BattleEmojiReq
 * REQ = BattleEmojiRequest
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=25016、recId=-1
 */
export class NetMsg_BattleEmoji_CN implements IHandle<BattleEmojiRequest, {}> {
  /** 请求消息号：BATTLE_EMOJI_REQ (25016) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.BATTLE_EMOJI_REQ;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: BattleEmojiRequest): {} {
    throw new Error('Handle not implemented: NetMsg_BattleEmojiReq');
  }
}
