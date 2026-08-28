// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: ReceiveGift

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  ReceiveGiftRequest,
  ReceiveGiftResponse,
} from 'mc-local-share';

/**
 * ReceiveGift
 * REQ = ReceiveGiftRequest
 * RES = ReceiveGiftResponse
 * 注册：reqId=10024、recId=10025
 */
export class NetMsg_ReceiveGift implements IHandle<ReceiveGiftRequest, ReceiveGiftResponse> {
  /** 请求消息号：RECEIVE_GIFT_REQ (10024) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.RECEIVE_GIFT_REQ;
  /** 响应消息号：RECEIVE_GIFT_REP (10025) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.RECEIVE_GIFT_REP;

  Handle(req: ReceiveGiftRequest): ReceiveGiftResponse {
    throw new Error('Handle not implemented: ReceiveGift');
  }
}
