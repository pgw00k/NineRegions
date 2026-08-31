// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_BuyClue

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiBuyMessageReq,
  InfiBuyMessageRep,
} from 'mc-local-share';

/**
 * Infi_BuyClue
 * REQ = InfiBuyMessageReq
 * RES = InfiBuyMessageRep
 * 注册：reqId=10112、recId=10113
 */
export class NetMsg_InfiBuyClue extends MessageBase<InfiBuyMessageReq, InfiBuyMessageRep> {
  /** 请求消息号：INFI_BUY_MESSAGE_REQ (10112) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_BUY_MESSAGE_REQ;
  /** 响应消息号：INFI_BUY_MESSAGE_REP (10113) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_BUY_MESSAGE_REP;

  override Handle(req: InfiBuyMessageReq): InfiBuyMessageRep {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Infi_BuyClue');
    }
    return resobj
  }
}
