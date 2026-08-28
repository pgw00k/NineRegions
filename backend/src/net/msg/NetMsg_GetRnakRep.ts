// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: GetRank

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  GetRankResponse,
} from 'mc-local-share';

/**
 * GetRank
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = GetRankResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10241
 */
export class NetMsg_GetRnakRep implements IHandle<PlayerInfoSimple, GetRankResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：GET_RANK_REP (10241) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GET_RANK_REP;

  Handle(req: PlayerInfoSimple): GetRankResponse {
    throw new Error('Handle not implemented: GetRank');
  }
}
