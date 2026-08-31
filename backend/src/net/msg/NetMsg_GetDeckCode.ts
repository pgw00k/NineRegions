// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_GetDeckCode

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetDeckCodeReq,
  GetDeckCodeRep,
} from 'mc-local-share';

/**
 * NetMsg_GetDeckCode
 * REQ = GetDeckCodeReq
 * RES = GetDeckCodeRep
 * 注册：reqId=10321、recId=10322
 */
export class NetMsg_GetDeckCode extends MessageBase<GetDeckCodeReq, GetDeckCodeRep> {
  /** 请求消息号：GET_DECKCODE_REQ (10321) */
  reqId: MESSAGE_ID = MESSAGE_ID.GET_DECKCODE_REQ;
  /** 响应消息号：GET_DECKCODE_REP (10322) */
  recId: MESSAGE_ID = MESSAGE_ID.GET_DECKCODE_REP;

  override Handle(req: GetDeckCodeReq): GetDeckCodeRep {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_GetDeckCode');
    }
    return resobj
  }
}
