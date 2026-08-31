// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ChampBattleComplete_SN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  ChampBattleComplete,
} from 'mc-local-share';

/**
 * NetMsg_ChampBattleComplete_SN
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = ChampBattleComplete
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15046
 */
export class NetMsg_ChampBattleComplete_SN implements IHandle<PlayerInfoSimple, ChampBattleComplete> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：CHAMP_BATTLE_COMPLETE (15046) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.CHAMP_BATTLE_COMPLETE;

  Handle(req: PlayerInfoSimple): ChampBattleComplete {
    throw new Error('Handle not implemented: NetMsg_ChampBattleComplete_SN');
  }
}
