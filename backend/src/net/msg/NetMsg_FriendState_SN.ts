// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_FriendState_SN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  FriendStateNtf,
} from 'mc-local-share';

/**
 * NetMsg_FriendState_SN
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = FriendStateNtf
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15033
 */
export class NetMsg_FriendState_SN implements IHandle<PlayerInfoSimple, FriendStateNtf> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：FRIEND_STATE_NTF (15033) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.FRIEND_STATE_NTF;

  Handle(req: PlayerInfoSimple): FriendStateNtf {
    throw new Error('Handle not implemented: NetMsg_FriendState_SN');
  }
}
