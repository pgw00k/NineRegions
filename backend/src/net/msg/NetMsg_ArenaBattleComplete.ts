// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ArenaBattleComplete

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  ArenaBattleComplete,
} from 'mc-local-share';

/**
 * NetMsg_ArenaBattleComplete
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = ArenaBattleComplete
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15013
 */
export class NetMsg_ArenaBattleComplete implements IHandle<PlayerInfoSimple, ArenaBattleComplete> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：ARENA_BATTLE_COMPLETE (15013) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.ARENA_BATTLE_COMPLETE;

  Handle(req: PlayerInfoSimple): ArenaBattleComplete {
    throw new Error('Handle not implemented: NetMsg_ArenaBattleComplete');
  }
}
