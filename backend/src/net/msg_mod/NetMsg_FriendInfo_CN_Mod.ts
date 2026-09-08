
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  FriendInfoRpt,
  FriendInfoNtf,
} from 'mc-local-share';
import { NetMsg_FriendInfo_CN } from '../msg/NetMsg_FriendInfo_CN';
import { Logger } from '../../core/Logger';

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
  override HandleSync(req: FriendInfoRpt): FriendInfoNtf|any {
    Logger.LogInfo('NetMsg_FriendInfo_CN_Mod.Handle', req);
    
    // 模拟返回好友数据（包括在线状态等）
    const fakeFriendsData = [
      {
        id: 1,
        uid: '123456789',
        name: '好友A',
        level: 25,
        avatar: 1,
        lastOnlineTime: Date.now() - 86400000,
        isOnline: true,
        status: 1,
        signature: '很高兴遇见你！'
      },
      {
        id: 2,
        uid: '987654321',
        name: '好友B',
        level: 30,
        avatar: 2,
        lastOnlineTime: Date.now() - 172800000,
        isOnline: false,
        status: 0,
        signature: '我在战斗！'
      },
      {
        id: 3,
        uid: '456789123',
        name: '好友C',
        level: 15,
        avatar: 3,
        lastOnlineTime: Date.now() - 36000000,
        isOnline: true,
        status: 1,
        signature: '新来的玩家'
      }
    ];

    return {
      friends: fakeFriendsData
    };
  }
}
