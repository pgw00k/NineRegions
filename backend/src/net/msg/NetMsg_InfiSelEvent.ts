// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_SelectEvent

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiSelectEventRequest,
  InfiSelectEventResponse,
} from 'mc-local-share';

/**
 * Infi_SelectEvent
 * REQ = InfiSelectEventRequest
 * RES = InfiSelectEventResponse
 * 注册：reqId=10086,recId=10087
 */
export class NetMsg_InfiSelEvent extends MessageBase<InfiSelectEventRequest, InfiSelectEventResponse> {
  /** 请求消息号：INFI_SELECT_EVENT_REQ (10086) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_EVENT_REQ;
  /** 响应消息号：INFI_SELECT_EVENT_REP (10087) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_EVENT_REP;

  override HandleSync(req: InfiSelectEventRequest, client?: Client): InfiSelectEventResponse {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: Infi_SelectEvent');
    }
    return resobj
  }
}
