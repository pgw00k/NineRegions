// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_SetHeadPicRsp

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  SetHeadPicRsp,
} from 'mc-local-share';

/**
 * NetMsg_SetHeadPicRsp
 * REQ = {}
 * RES = SetHeadPicRsp
 * 注册：reqId=0、recId=10345
 */
export class NetMsg_SetHeadPicRsp extends MessageBase<{}, SetHeadPicRsp> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：SET_HEAD_PIC_RSP (10345) */
  recId: MESSAGE_ID = MESSAGE_ID.SET_HEAD_PIC_RSP;

  override Handle(req: {}): SetHeadPicRsp {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_SetHeadPicRsp');
    }
    return resobj
  }
}
