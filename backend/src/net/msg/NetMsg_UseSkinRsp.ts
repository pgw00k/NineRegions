// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_UseSkin

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  UseSkinRsp,
} from 'mc-local-share';

/**
 * NetMsg_UseSkin
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = UseSkinRsp
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10395
 */
export class NetMsg_UseSkinRsp implements IHandle<PlayerInfoSimple, UseSkinRsp> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：USE_SKIN_RSP (10395) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.USE_SKIN_RSP;

  Handle(req: PlayerInfoSimple): UseSkinRsp {
    throw new Error('Handle not implemented: NetMsg_UseSkin');
  }
}
