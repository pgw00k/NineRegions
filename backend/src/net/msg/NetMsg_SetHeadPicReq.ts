// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_SetHeadPicReq

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  SetHeadPicReq,
} from 'mc-local-share';

/**
 * NetMsg_SetHeadPicReq
 * REQ = SetHeadPicReq
 * RES = {}
 * 注册：reqId=10344、recId=0
 */
export class NetMsg_SetHeadPicReq extends MessageBase<SetHeadPicReq, {}> {
  /** 请求消息号：SET_HEAD_PIC_REQ (10344) */
  reqId: MESSAGE_ID = MESSAGE_ID.SET_HEAD_PIC_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: SetHeadPicReq): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_SetHeadPicReq');
    }
    return resobj
  }
}
