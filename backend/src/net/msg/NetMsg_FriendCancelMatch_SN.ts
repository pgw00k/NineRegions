// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: FriendCancelMatch_SN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  FriendOpStatusNtf,
} from 'mc-local-share';

/**
 * FriendCancelMatch_SN
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = FriendOpStatusNtf
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15037
 */
export class NetMsg_FriendCancelMatch_SN implements IHandle<PlayerInfoSimple, FriendOpStatusNtf> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：FRIEND_OP_STATUS_NTF (15037) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.FRIEND_OP_STATUS_NTF;

  Handle(req: PlayerInfoSimple): FriendOpStatusNtf {
    throw new Error('Handle not implemented: FriendCancelMatch_SN');
  }
}
