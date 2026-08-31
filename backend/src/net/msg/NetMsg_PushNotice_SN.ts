// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_PushNotice_SN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  PushNoticeRsp,
} from 'mc-local-share';

/**
 * NetMsg_PushNotice_SN
 * REQ = {}
 * RES = PushNoticeRsp
 * 注册：reqId=0、recId=15042
 */
export class NetMsg_PushNotice_SN extends MessageBase<{}, PushNoticeRsp> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：PUSH_NOTICE_RSP (15042) */
  recId: MESSAGE_ID = MESSAGE_ID.PUSH_NOTICE_RSP;

  override Handle(req: {}): PushNoticeRsp {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_PushNotice_SN');
    }
    return resobj
  }
}
