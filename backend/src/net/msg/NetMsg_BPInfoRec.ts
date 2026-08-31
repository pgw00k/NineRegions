// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: BP_RecInfo

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  BattlePassResponse,
} from 'mc-local-share';

/**
 * BP_RecInfo
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = BattlePassResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10281
 */
export class NetMsg_BPInfoRec implements IHandle<PlayerInfoSimple, BattlePassResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：BATTLEPASS_REP (10281) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.BATTLEPASS_REP;

  Handle(req: PlayerInfoSimple): BattlePassResponse {
    throw new Error('Handle not implemented: BP_RecInfo');
  }
}
