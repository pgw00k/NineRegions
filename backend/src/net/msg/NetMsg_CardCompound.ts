// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_CardCompound

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  CardCompoundRequest,
  CardCompoundResponse,
} from 'mc-local-share';

/**
 * NetMsg_CardCompound
 * REQ = CardCompoundRequest
 * RES = CardCompoundResponse
 * 注册：reqId=10043、recId=10044
 */
export class NetMsg_CardCompound implements IHandle<CardCompoundRequest, CardCompoundResponse> {
  /** 请求消息号：CARD_COMPOUND_REQ (10043) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.CARD_COMPOUND_REQ;
  /** 响应消息号：CARD_COMPOUND_REP (10044) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.CARD_COMPOUND_REP;

  Handle(req: CardCompoundRequest): CardCompoundResponse {
    throw new Error('Handle not implemented: NetMsg_CardCompound');
  }
}
