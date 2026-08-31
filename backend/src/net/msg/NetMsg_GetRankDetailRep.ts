// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: GetRankDetail

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetRankDetailResponse,
} from 'mc-local-share';

/**
 * GetRankDetail
 * REQ = {}
 * RES = GetRankDetailResponse
 * 注册：reqId=0、recId=10243
 */
export class NetMsg_GetRankDetailRep extends MessageBase<{}, GetRankDetailResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：GET_RANK_DETAIL_REP (10243) */
  recId: MESSAGE_ID = MESSAGE_ID.GET_RANK_DETAIL_REP;

  override Handle(req: {}): GetRankDetailResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: GetRankDetail');
    }
    return resobj
  }
}
