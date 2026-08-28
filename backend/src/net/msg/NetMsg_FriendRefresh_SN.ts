// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_FriendRefresh_SN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  FriendRefreshRearchNtf,
} from 'mc-local-share';

/**
 * NetMsg_FriendRefresh_SN
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = FriendRefreshRearchNtf
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15039
 */
export class NetMsg_FriendRefresh_SN implements IHandle<PlayerInfoSimple, FriendRefreshRearchNtf> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：FRIEND_REFRESH_SREARCH_NTF (15039) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.FRIEND_REFRESH_SREARCH_NTF;

  Handle(req: PlayerInfoSimple): FriendRefreshRearchNtf {
    throw new Error('Handle not implemented: NetMsg_FriendRefresh_SN');
  }
}
