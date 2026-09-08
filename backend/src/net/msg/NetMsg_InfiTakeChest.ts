// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_TakeChest

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiGetBoxRequest,
  InfiGetBoxResponse,
} from 'mc-local-share';

/**
 * Infi_TakeChest
 * REQ = InfiGetBoxRequest
 * RES = InfiGetBoxResponse
 * 注册：reqId=10103,recId=10104
 */
export class NetMsg_InfiTakeChest extends MessageBase<InfiGetBoxRequest, InfiGetBoxResponse> {
  /** 请求消息号：INFI_GET_BOX_REQ (10103) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_GET_BOX_REQ;
  /** 响应消息号：INFI_GET_BOX_REP (10104) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_GET_BOX_REP;

  override HandleSync(req: InfiGetBoxRequest, client?: Client, uid?: string, token?: string,exData?:any): InfiGetBoxResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: Infi_TakeChest');
    }
    return resobj
  }
}
