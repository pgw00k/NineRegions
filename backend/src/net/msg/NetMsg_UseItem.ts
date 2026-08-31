// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_UseItem

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  UseItemRequest,
  UseItemResponse,
} from 'mc-local-share';

/**
 * NetMsg_UseItem
 * REQ = UseItemRequest
 * RES = UseItemResponse
 * 注册：reqId=10045、recId=10046
 */
export class NetMsg_UseItem extends MessageBase<UseItemRequest, UseItemResponse> {
  /** 请求消息号：USE_ITEM_REQ (10045) */
  reqId: MESSAGE_ID = MESSAGE_ID.USE_ITEM_REQ;
  /** 响应消息号：USE_ITEM_REP (10046) */
  recId: MESSAGE_ID = MESSAGE_ID.USE_ITEM_REP;

  override Handle(req: UseItemRequest): UseItemResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_UseItem');
    }
    return resobj
  }
}
