// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_SetHeadInfo_CN

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  SetHeadInfoReq,
} from 'mc-local-share';

/**
 * NetMsg_SetHeadInfo_CN
 * REQ = SetHeadInfoReq
 * RES = {}
 * 注册：reqId=10376,recId=0
 */
export class NetMsg_SetHeadInfo_CN extends MessageBase<SetHeadInfoReq, {}> {
  /** 请求消息号：SET_HEAD_INFO_REQ (10376) */
  reqId: MESSAGE_ID = MESSAGE_ID.SET_HEAD_INFO_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override HandleSync(req: SetHeadInfoReq, client?: Client, uid?: string, token?: string,exData?:any): {} {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_SetHeadInfo_CN');
    }
    return resobj
  }
}
