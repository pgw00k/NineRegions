// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ChangeDefaultCardBack

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  ChangeDefaultCardBackRequest,
  ChangeDefaultCardBackResponse,
} from 'mc-local-share';

/**
 * NetMsg_ChangeDefaultCardBack
 * REQ = ChangeDefaultCardBackRequest
 * RES = ChangeDefaultCardBackResponse
 * 注册：reqId=10131、recId=10132
 */
export class NetMsg_ChangeDefaultCardBack implements IHandle<ChangeDefaultCardBackRequest, ChangeDefaultCardBackResponse> {
  /** 请求消息号：CHANGE_DEFAULT_CARDBACK_REQ (10131) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.CHANGE_DEFAULT_CARDBACK_REQ;
  /** 响应消息号：CHANGE_DEFAULT_CARDBACK_REP (10132) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.CHANGE_DEFAULT_CARDBACK_REP;

  Handle(req: ChangeDefaultCardBackRequest): ChangeDefaultCardBackResponse {
    throw new Error('Handle not implemented: NetMsg_ChangeDefaultCardBack');
  }
}
