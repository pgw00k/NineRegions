// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_FriendRefreshScenes_CN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  FriendRefreshScenceRpt,
} from 'mc-local-share';

/**
 * NetMsg_FriendRefreshScenes_CN
 * REQ = FriendRefreshScenceRpt
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=15040、recId=-1
 */
export class NetMsg_FriendRefreshScenes_CN implements IHandle<FriendRefreshScenceRpt, {}> {
  /** 请求消息号：FRIEND_REFRESH_SCENE_RPT (15040) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.FRIEND_REFRESH_SCENE_RPT;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: FriendRefreshScenceRpt): {} {
    throw new Error('Handle not implemented: NetMsg_FriendRefreshScenes_CN');
  }
}
