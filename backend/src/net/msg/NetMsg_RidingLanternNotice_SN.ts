// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: RidingLanternNotice

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  AnnounceLamp,
} from 'mc-local-share';

/**
 * RidingLanternNotice
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = AnnounceLamp
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10226
 */
export class NetMsg_RidingLanternNotice_SN implements IHandle<PlayerInfoSimple, AnnounceLamp> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：ANNOUNCE_LAMP_PUSH (10226) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.ANNOUNCE_LAMP_PUSH;

  Handle(req: PlayerInfoSimple): AnnounceLamp {
    throw new Error('Handle not implemented: RidingLanternNotice');
  }
}
