// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: BP_Active

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  BattlePassActiveResponse,
} from 'mc-local-share';

/**
 * BP_Active
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = BattlePassActiveResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10287
 */
export class NetMsg_BPActive implements IHandle<PlayerInfoSimple, BattlePassActiveResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：BATTLEPASS_ACTIVE_REP (10287) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.BATTLEPASS_ACTIVE_REP;

  Handle(req: PlayerInfoSimple): BattlePassActiveResponse {
    throw new Error('Handle not implemented: BP_Active');
  }
}
