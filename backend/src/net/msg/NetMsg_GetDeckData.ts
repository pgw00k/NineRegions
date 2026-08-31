// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_GetDeckData

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetDeckDataReq,
  GetDeckDataRep,
} from 'mc-local-share';

/**
 * NetMsg_GetDeckData
 * REQ = GetDeckDataReq
 * RES = GetDeckDataRep
 * 注册：reqId=10323、recId=10324
 */
export class NetMsg_GetDeckData extends MessageBase<GetDeckDataReq, GetDeckDataRep> {
  /** 请求消息号：GET_DECKDATA_REQ (10323) */
  reqId: MESSAGE_ID = MESSAGE_ID.GET_DECKDATA_REQ;
  /** 响应消息号：GET_DECKDATA_REP (10324) */
  recId: MESSAGE_ID = MESSAGE_ID.GET_DECKDATA_REP;

  override Handle(req: GetDeckDataReq): GetDeckDataRep {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_GetDeckData');
    }
    return resobj
  }
}
