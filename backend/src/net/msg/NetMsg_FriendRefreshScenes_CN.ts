// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_FriendRefreshScenes_CN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  FriendRefreshScenceRpt,
} from 'mc-local-share';

/**
 * NetMsg_FriendRefreshScenes_CN
 * REQ = FriendRefreshScenceRpt
 * RES = {}
 * 注册：reqId=15040、recId=0
 */
export class NetMsg_FriendRefreshScenes_CN extends MessageBase<FriendRefreshScenceRpt, {}> {
  /** 请求消息号：FRIEND_REFRESH_SCENE_RPT (15040) */
  reqId: MESSAGE_ID = MESSAGE_ID.FRIEND_REFRESH_SCENE_RPT;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: FriendRefreshScenceRpt): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_FriendRefreshScenes_CN');
    }
    return resobj
  }
}
