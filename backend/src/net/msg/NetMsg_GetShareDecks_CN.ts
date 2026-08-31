// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_GetShareDecks_CN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetSharedDecksReq,
} from 'mc-local-share';

/**
 * NetMsg_GetShareDecks_CN
 * REQ = GetSharedDecksReq
 * RES = {}
 * 注册：reqId=10360、recId=0
 */
export class NetMsg_GetShareDecks_CN extends MessageBase<GetSharedDecksReq, {}> {
  /** 请求消息号：GET_SHAREDDECKS_REQ (10360) */
  reqId: MESSAGE_ID = MESSAGE_ID.GET_SHAREDDECKS_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: GetSharedDecksReq): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_GetShareDecks_CN');
    }
    return resobj
  }
}
