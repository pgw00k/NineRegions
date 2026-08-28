// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_FriendInfo_CN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  FriendInfoRpt,
} from 'mc-local-share';

/**
 * NetMsg_FriendInfo_CN
 * REQ = FriendInfoRpt
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=15031、recId=-1
 */
export class NetMsg_FriendInfo_CN implements IHandle<FriendInfoRpt, {}> {
  /** 请求消息号：FRIEND_INFO_RPT (15031) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.FRIEND_INFO_RPT;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: FriendInfoRpt): {} {
    throw new Error('Handle not implemented: NetMsg_FriendInfo_CN');
  }
}
