// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_FriendInfo_SN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  FriendInfoNtf,
} from 'mc-local-share';

/**
 * NetMsg_FriendInfo_SN
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = FriendInfoNtf
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15032
 */
export class NetMsg_FriendInfo_SN implements IHandle<PlayerInfoSimple, FriendInfoNtf> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：FRIEND_INFO_NTF (15032) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.FRIEND_INFO_NTF;

  Handle(req: PlayerInfoSimple): FriendInfoNtf {
    throw new Error('Handle not implemented: NetMsg_FriendInfo_SN');
  }
}
