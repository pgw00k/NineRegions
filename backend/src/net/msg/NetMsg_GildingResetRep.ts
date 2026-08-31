// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_GildingResetRep

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GildingResetResponse,
} from 'mc-local-share';

/**
 * NetMsg_GildingResetRep
 * REQ = {}
 * RES = GildingResetResponse
 * 注册：reqId=0、recId=10433
 */
export class NetMsg_GildingResetRep extends MessageBase<{}, GildingResetResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：GILDING_RESET_REP (10433) */
  recId: MESSAGE_ID = MESSAGE_ID.GILDING_RESET_REP;

  override Handle(req: {}): GildingResetResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_GildingResetRep');
    }
    return resobj
  }
}
