// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_Timeout_SN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
} from 'mc-local-share';

/**
 * NetMsg_Timeout_SN
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = {}（recvProto 缺失，回退）
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=-1、recId=8
 */
export class NetMsg_Timeout_SN implements IHandle<PlayerInfoSimple, {}> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：TIMEOUT (8) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.TIMEOUT;

  Handle(req: PlayerInfoSimple): {} {
    throw new Error('Handle not implemented: NetMsg_Timeout_SN');
  }
}
