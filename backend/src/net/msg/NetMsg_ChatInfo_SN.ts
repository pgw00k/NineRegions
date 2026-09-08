// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ChatInfo_SN

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ChatInfoNtf,
} from 'mc-local-share';

/**
 * NetMsg_ChatInfo_SN
 * REQ = {}
 * RES = ChatInfoNtf
 * 注册：reqId=0,recId=15028
 */
export class NetMsg_ChatInfo_SN extends MessageBase<{}, ChatInfoNtf> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：CHAT_INFO_NTF (15028) */
  recId: MESSAGE_ID = MESSAGE_ID.CHAT_INFO_NTF;

  override HandleSync(req: {}, client?: Client): ChatInfoNtf {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_ChatInfo_SN');
    }
    return resobj
  }
}
