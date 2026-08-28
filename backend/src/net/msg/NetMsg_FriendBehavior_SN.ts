// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_FriendBehavior_SN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  FriendBehaviorNtf,
} from 'mc-local-share';

/**
 * NetMsg_FriendBehavior_SN
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = FriendBehaviorNtf
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15025
 */
export class NetMsg_FriendBehavior_SN implements IHandle<PlayerInfoSimple, FriendBehaviorNtf> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：FRIEND_BEHAVIOR_NTF (15025) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.FRIEND_BEHAVIOR_NTF;

  Handle(req: PlayerInfoSimple): FriendBehaviorNtf {
    throw new Error('Handle not implemented: NetMsg_FriendBehavior_SN');
  }
}
