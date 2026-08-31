// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_BattleQuit

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
} from 'mc-local-share';

/**
 * NetMsg_BattleQuit
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = {}（recvProto 缺失，回退）
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=25009、recId=-1
 */
export class NetMsg_BattleQuit_CN implements IHandle<PlayerInfoSimple, {}> {
  /** 请求消息号：QUIT_BATTLE_REQ (25009) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.QUIT_BATTLE_REQ;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: PlayerInfoSimple): {} {
    throw new Error('Handle not implemented: NetMsg_BattleQuit');
  }
}
