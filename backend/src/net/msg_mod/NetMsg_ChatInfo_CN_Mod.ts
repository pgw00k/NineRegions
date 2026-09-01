
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ChatInfoRpt,
  ChatInfoNtf,
} from 'mc-local-share';
import { NetMsg_ChatInfo_CN } from '../msg/NetMsg_ChatInfo_CN';

/**
 * NetMsg_ChatInfo_CN_Mod
 * REQ = ChatInfoRpt
 * RES = ChatInfoNtf
 * 注册：reqId=15027,recId=15028
 */
export class NetMsg_ChatInfo_CN_Mod extends NetMsg_ChatInfo_CN {
  /** 请求消息号：BATTLEPASS_REQ (15027) */
  reqId: MESSAGE_ID = MESSAGE_ID.CHAT_INFO_RPT;
  /** 响应消息号：BATTLEPASS_REP (15028) */
  recId: MESSAGE_ID = MESSAGE_ID.CHAT_INFO_NTF;
  override Handle(req: ChatInfoRpt): ChatInfoNtf|any {
    return super.Handle(req);
  }
}
