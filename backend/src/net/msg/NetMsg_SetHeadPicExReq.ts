// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_SetHeadPicExReq

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  SetHeadPicExReq,
} from 'mc-local-share';

/**
 * NetMsg_SetHeadPicExReq
 * REQ = SetHeadPicExReq
 * RES = {}
 * 注册：reqId=10346,recId=0
 */
export class NetMsg_SetHeadPicExReq extends MessageBase<SetHeadPicExReq, {}> {
  /** 请求消息号：SET_HEAD_PIC_EX_REQ (10346) */
  reqId: MESSAGE_ID = MESSAGE_ID.SET_HEAD_PIC_EX_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override HandleSync(req: SetHeadPicExReq, client?: Client, uid?: string, token?: string,exData?:any): {} {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_SetHeadPicExReq');
    }
    return resobj
  }
}
