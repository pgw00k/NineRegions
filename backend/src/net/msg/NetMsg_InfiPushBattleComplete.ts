// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Infi_PushBattleComplete

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  InfiBattleComplete,
} from 'mc-local-share';

/**
 * Infi_PushBattleComplete
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = InfiBattleComplete
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10096
 */
export class NetMsg_InfiPushBattleComplete implements IHandle<PlayerInfoSimple, InfiBattleComplete> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：INFI_BATTLE_COMPLETE (10096) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.INFI_BATTLE_COMPLETE;

  Handle(req: PlayerInfoSimple): InfiBattleComplete {
    throw new Error('Handle not implemented: Infi_PushBattleComplete');
  }
}
