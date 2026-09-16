// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: ShowEnd

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ShowEndRequest,
} from 'mc-local-share';

/**
 * ShowEnd
 * REQ = ShowEndRequest
 * RES = {}
 * 注册：reqId=25012,recId=0
 */
export class NetMsg_ShowEnd extends MessageBase<ShowEndRequest, {}> {
  /** 请求消息号：SHOW_END_REQ (25012) */
  reqId: MESSAGE_ID = MESSAGE_ID.SHOW_END_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override HandleSync(req: ShowEndRequest, client?: Client, uid?: string, token?: string,exData?:any): {} {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: ShowEnd');
    }
    return resobj
  }
}
