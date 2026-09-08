// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_QueryFriendInfo

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  QueryFriendInfoReq,
  QueryFriendInfoRsp,
} from 'mc-local-share';
import { NetMsg_QueryFriendInfo } from '../msg/NetMsg_QueryFriendInfo';

/**
 * NetMsg_QueryFriendInfo
 * REQ = QueryFriendInfoReq
 * RES = QueryFriendInfoRsp
 * 注册：reqId=10460,recId=10461
 */
export class NetMsg_QueryFriendInfo_Mod extends NetMsg_QueryFriendInfo {

  override HandleSync(req: QueryFriendInfoReq): QueryFriendInfoRsp {
    let resobj = super.HandleSync(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_QueryFriendInfo');
    }
    return resobj
  }
}
