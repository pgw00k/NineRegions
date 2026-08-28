// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: GetRankDetail

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  GetRankDetailResponse,
} from 'mc-local-share';

/**
 * GetRankDetail
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = GetRankDetailResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10243
 */
export class NetMsg_GetRankDetailRep implements IHandle<PlayerInfoSimple, GetRankDetailResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：GET_RANK_DETAIL_REP (10243) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GET_RANK_DETAIL_REP;

  Handle(req: PlayerInfoSimple): GetRankDetailResponse {
    throw new Error('Handle not implemented: GetRankDetail');
  }
}
