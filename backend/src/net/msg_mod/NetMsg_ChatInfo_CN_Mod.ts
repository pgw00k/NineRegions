
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ChatInfoRpt,
  ChatInfoNtf,
} from 'mc-local-share';
import { NetMsg_ChatInfo_CN } from '../msg/NetMsg_ChatInfo_CN';
import { Logger } from '../../core/Logger';

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
  override HandleSync(req: ChatInfoRpt): ChatInfoNtf|any {
    Logger.LogInfo('NetMsg_ChatInfo_CN_Mod.Handle', req);
    
    // 模拟返回聊天数据
    const fakeChatData = [
      {
        id: 1,
        fromUid: '123456789',
        toUid: '0',
        type: 1,      // 全服消息
        content: "欢迎来到游戏！",
        sendTime: Date.now() - 3600000,
        avatar: 1,
        name: '系统',
        level: 100
      },
      {
        id: 2,
        fromUid: '987654321',
        toUid: '0',
        type: 3,      // 好友消息
        content: "你好啊！",
        sendTime: Date.now() - 1800000,
        avatar: 2,
        name: '好友B',
        level: 30
      },
      {
        id: 3,
        fromUid: '456789123',
        toUid: '0',
        type: 4,      // 队伍消息
        content: "一起组队打副本吧！",
        sendTime: Date.now() - 1200000,
        avatar: 3,
        name: '好友C',
        level: 15
      }
    ];

    return {
      chats: fakeChatData
    };
  }
}
