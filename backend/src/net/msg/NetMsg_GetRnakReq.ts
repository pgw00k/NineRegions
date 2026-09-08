// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: GetRank

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetRankRequest,
} from 'mc-local-share';

/**
 * GetRank
 * REQ = GetRankRequest
 * RES = {}
 * 注册：reqId=10240,recId=0
 */
export class NetMsg_GetRnakReq extends MessageBase<GetRankRequest, {}> {
  /** 请求消息号：GET_RANK_REQ (10240) */
  reqId: MESSAGE_ID = MESSAGE_ID.GET_RANK_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override HandleSync(req: GetRankRequest, client?: Client): {} {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: GetRank');
    }
    return resobj
  }
}
