// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_SetUserTitle

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  SetUserTitleReq,
  SetUserTitleRsp,
} from 'mc-local-share';

/**
 * NetMsg_SetUserTitle
 * REQ = SetUserTitleReq
 * RES = SetUserTitleRsp
 * 注册：reqId=10372,recId=10373
 */
export class NetMsg_SetUserTitle extends MessageBase<SetUserTitleReq, SetUserTitleRsp> {
  /** 请求消息号：SET_USERTITLE_REQ (10372) */
  reqId: MESSAGE_ID = MESSAGE_ID.SET_USERTITLE_REQ;
  /** 响应消息号：SET_USERTITLE_RSP (10373) */
  recId: MESSAGE_ID = MESSAGE_ID.SET_USERTITLE_RSP;

  override HandleSync(req: SetUserTitleReq, client?: Client, uid?: string, token?: string,exData?:any): SetUserTitleRsp {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_SetUserTitle');
    }
    return resobj
  }
}
