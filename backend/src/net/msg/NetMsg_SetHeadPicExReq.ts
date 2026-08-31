// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_SetHeadPicExReq

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  SetHeadPicExReq,
} from 'mc-local-share';

/**
 * NetMsg_SetHeadPicExReq
 * REQ = SetHeadPicExReq
 * RES = {}
 * 注册：reqId=10346、recId=0
 */
export class NetMsg_SetHeadPicExReq extends MessageBase<SetHeadPicExReq, {}> {
  /** 请求消息号：SET_HEAD_PIC_EX_REQ (10346) */
  reqId: MESSAGE_ID = MESSAGE_ID.SET_HEAD_PIC_EX_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: SetHeadPicExReq): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_SetHeadPicExReq');
    }
    return resobj
  }
}
