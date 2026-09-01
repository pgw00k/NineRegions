
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  FriendInfoRpt,
  FriendInfoNtf,
} from 'mc-local-share';
import { NetMsg_FriendInfo_CN } from '../msg/NetMsg_FriendInfo_CN';

/**
 * NetMsg_FriendInfo_CN_Mod
 * REQ = FriendInfoNtf
 * RES = {}
 * 注册：reqId=15031,recId=15032
 */
export class NetMsg_FriendInfo_CN_Mod extends NetMsg_FriendInfo_CN {
  /** 请求消息号：BATTLEPASS_REQ (15031) */
  reqId: MESSAGE_ID = MESSAGE_ID.FRIEND_INFO_RPT;
  /** 响应消息号：BATTLEPASS_REP (15032) */
  recId: MESSAGE_ID = MESSAGE_ID.FRIEND_INFO_NTF;
  override Handle(req: FriendInfoRpt): FriendInfoNtf|any {
    return super.Handle(req);
  }
}
