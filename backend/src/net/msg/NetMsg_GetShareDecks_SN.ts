// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_GetShareDecks_SN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetSharedDecksRep,
} from 'mc-local-share';

/**
 * NetMsg_GetShareDecks_SN
 * REQ = {}
 * RES = GetSharedDecksRep
 * 注册：reqId=0、recId=10361
 */
export class NetMsg_GetShareDecks_SN extends MessageBase<{}, GetSharedDecksRep> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：GET_SHAREDDECKS_REP (10361) */
  recId: MESSAGE_ID = MESSAGE_ID.GET_SHAREDDECKS_REP;

  override Handle(req: {}): GetSharedDecksRep {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_GetShareDecks_SN');
    }
    return resobj
  }
}
