// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ChatInfo_SN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ChatInfoNtf,
} from 'mc-local-share';

/**
 * NetMsg_ChatInfo_SN
 * REQ = {}
 * RES = ChatInfoNtf
 * 注册：reqId=0、recId=15028
 */
export class NetMsg_ChatInfo_SN extends MessageBase<{}, ChatInfoNtf> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：CHAT_INFO_NTF (15028) */
  recId: MESSAGE_ID = MESSAGE_ID.CHAT_INFO_NTF;

  override Handle(req: {}): ChatInfoNtf {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_ChatInfo_SN');
    }
    return resobj
  }
}
