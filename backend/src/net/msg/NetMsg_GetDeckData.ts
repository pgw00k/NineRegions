// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_GetDeckData

import { IHandle } from '../IHandle';
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
export class NetMsg_GetDeckData implements IHandle<GetDeckDataReq, GetDeckDataRep> {
  /** 请求消息号：GET_DECKDATA_REQ (10323) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.GET_DECKDATA_REQ;
  /** 响应消息号：GET_DECKDATA_REP (10324) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GET_DECKDATA_REP;

  Handle(req: GetDeckDataReq): GetDeckDataRep {
    throw new Error('Handle not implemented: NetMsg_GetDeckData');
  }
}
