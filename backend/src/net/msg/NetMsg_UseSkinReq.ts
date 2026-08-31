// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_UseSkin

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  UseSkinReq,
} from 'mc-local-share';

/**
 * NetMsg_UseSkin
 * REQ = UseSkinReq
 * RES = {}
 * 注册：reqId=10394、recId=0
 */
export class NetMsg_UseSkinReq extends MessageBase<UseSkinReq, {}> {
  /** 请求消息号：USE_SKIN_REQ (10394) */
  reqId: MESSAGE_ID = MESSAGE_ID.USE_SKIN_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: UseSkinReq): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_UseSkin');
    }
    return resobj
  }
}
