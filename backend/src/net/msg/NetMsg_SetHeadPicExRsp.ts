// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_SetHeadPicExRsp

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  SetHeadPicExRsp,
} from 'mc-local-share';

/**
 * NetMsg_SetHeadPicExRsp
 * REQ = {}
 * RES = SetHeadPicExRsp
 * 注册：reqId=0、recId=10347
 */
export class NetMsg_SetHeadPicExRsp extends MessageBase<{}, SetHeadPicExRsp> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：SET_HEAD_PIC_EX_RSP (10347) */
  recId: MESSAGE_ID = MESSAGE_ID.SET_HEAD_PIC_EX_RSP;

  override Handle(req: {}): SetHeadPicExRsp {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_SetHeadPicExRsp');
    }
    return resobj
  }
}
