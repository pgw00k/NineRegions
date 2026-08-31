// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: GetRank

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetRankResponse,
} from 'mc-local-share';

/**
 * GetRank
 * REQ = {}
 * RES = GetRankResponse
 * 注册：reqId=0、recId=10241
 */
export class NetMsg_GetRnakRep extends MessageBase<{}, GetRankResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：GET_RANK_REP (10241) */
  recId: MESSAGE_ID = MESSAGE_ID.GET_RANK_REP;

  override Handle(req: {}): GetRankResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: GetRank');
    }
    return resobj
  }
}
