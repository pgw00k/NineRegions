// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Infi_BuyClue

import { IHandle } from '../IHandle';
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
export class NetMsg_InfiBuyClue implements IHandle<InfiBuyMessageReq, InfiBuyMessageRep> {
  /** 请求消息号：INFI_BUY_MESSAGE_REQ (10112) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.INFI_BUY_MESSAGE_REQ;
  /** 响应消息号：INFI_BUY_MESSAGE_REP (10113) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.INFI_BUY_MESSAGE_REP;

  Handle(req: InfiBuyMessageReq): InfiBuyMessageRep {
    throw new Error('Handle not implemented: Infi_BuyClue');
  }
}
