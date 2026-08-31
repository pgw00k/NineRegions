// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_RMB_PVE_SN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  PveBuyPush,
} from 'mc-local-share';

/**
 * NetMsg_RMB_PVE_SN
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = PveBuyPush
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15045
 */
export class NetMsg_RMB_PVE_SN implements IHandle<PlayerInfoSimple, PveBuyPush> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：PVE_BUY_PUSH (15045) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.PVE_BUY_PUSH;

  Handle(req: PlayerInfoSimple): PveBuyPush {
    throw new Error('Handle not implemented: NetMsg_RMB_PVE_SN');
  }
}
