// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_QueryFriendInfo

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  QueryFriendInfoReq,
  QueryFriendInfoRsp,
} from 'mc-local-share';
import { NetMsg_QueryFriendInfo } from '../msg/NetMsg_QueryFriendInfo';
import { Client } from '../Client';
import { PlayerService } from '../../database/service/Player.service';

/**
 * NetMsg_QueryFriendInfo
 * REQ = QueryFriendInfoReq
 * RES = QueryFriendInfoRsp
 * 注册：reqId=10460,recId=10461
 */
export class NetMsg_QueryFriendInfo_Mod extends NetMsg_QueryFriendInfo {
  override async Handle(req: QueryFriendInfoReq, client?: Client, uid?: string, token?: string, exData?: any): Promise<QueryFriendInfoRsp> {
    let suid = uid || client?.uid;
    if (!suid) {
      return Promise.resolve({});
    }
    let player = await PlayerService.Instance.GetPlayerByID(suid);
    return super.Handle(req, client, suid, token, exData);
  }
}
