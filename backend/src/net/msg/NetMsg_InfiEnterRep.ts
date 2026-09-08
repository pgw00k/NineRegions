// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_EnterRep

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiEnterResponse,
} from 'mc-local-share';

/**
 * Infi_EnterRep
 * REQ = {}
 * RES = InfiEnterResponse
 * 注册：reqId=0,recId=10081
 */
export class NetMsg_InfiEnterRep extends MessageBase<{}, InfiEnterResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：INFI_ENTER_REP (10081) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_ENTER_REP;

  override HandleSync(req: {}, client?: Client): InfiEnterResponse {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: Infi_EnterRep');
    }
    return resobj
  }
}
