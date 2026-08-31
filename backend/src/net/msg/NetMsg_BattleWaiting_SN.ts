// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_SN_BattleWaiting

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  PushBattleWaiting,
} from 'mc-local-share';

/**
 * NetMsg_SN_BattleWaiting
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = PushBattleWaiting
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=25015
 */
export class NetMsg_BattleWaiting_SN implements IHandle<PlayerInfoSimple, PushBattleWaiting> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：PUSH_BATTLEWAITING (25015) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.PUSH_BATTLEWAITING;

  Handle(req: PlayerInfoSimple): PushBattleWaiting {
    throw new Error('Handle not implemented: NetMsg_SN_BattleWaiting');
  }
}
