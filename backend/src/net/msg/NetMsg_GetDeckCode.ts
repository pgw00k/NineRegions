// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_GetDeckCode

import { IHandle } from '../IHandle';
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
export class NetMsg_GetDeckCode implements IHandle<GetDeckCodeReq, GetDeckCodeRep> {
  /** 请求消息号：GET_DECKCODE_REQ (10321) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.GET_DECKCODE_REQ;
  /** 响应消息号：GET_DECKCODE_REP (10322) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GET_DECKCODE_REP;

  Handle(req: GetDeckCodeReq): GetDeckCodeRep {
    throw new Error('Handle not implemented: NetMsg_GetDeckCode');
  }
}
