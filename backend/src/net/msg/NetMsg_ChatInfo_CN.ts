// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ChatInfo_CN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ChatInfoRpt,
} from 'mc-local-share';

/**
 * NetMsg_ChatInfo_CN
 * REQ = ChatInfoRpt
 * RES = {}
 * 注册：reqId=15027、recId=0
 */
export class NetMsg_ChatInfo_CN extends MessageBase<ChatInfoRpt, {}> {
  /** 请求消息号：CHAT_INFO_RPT (15027) */
  reqId: MESSAGE_ID = MESSAGE_ID.CHAT_INFO_RPT;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: ChatInfoRpt): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_ChatInfo_CN');
    }
    return resobj
  }
}
