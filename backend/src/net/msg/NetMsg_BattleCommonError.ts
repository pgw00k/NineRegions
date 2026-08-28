// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_BattleCommonError

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  BattleCommonError,
} from 'mc-local-share';

/**
 * NetMsg_BattleCommonError
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = BattleCommonError
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=25013
 */
export class NetMsg_BattleCommonError implements IHandle<PlayerInfoSimple, BattleCommonError> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：BATTLE_COMMONERROR_REP (25013) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.BATTLE_COMMONERROR_REP;

  Handle(req: PlayerInfoSimple): BattleCommonError {
    throw new Error('Handle not implemented: NetMsg_BattleCommonError');
  }
}
