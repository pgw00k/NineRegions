// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: GetRankDetail

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetRankDetailRequest,
} from 'mc-local-share';

/**
 * GetRankDetail
 * REQ = GetRankDetailRequest
 * RES = {}
 * 注册：reqId=10242、recId=0
 */
export class NetMsg_GetRankDetailReq extends MessageBase<GetRankDetailRequest, {}> {
  /** 请求消息号：GET_RANK_DETAIL_REQ (10242) */
  reqId: MESSAGE_ID = MESSAGE_ID.GET_RANK_DETAIL_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: GetRankDetailRequest): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: GetRankDetail');
    }
    return resobj
  }
}
