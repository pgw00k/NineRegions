// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_PVECompletePush

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  PushPVEComplete,
} from 'mc-local-share';

/**
 * NetMsg_PVECompletePush
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = PushPVEComplete
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15003
 */
export class NetMsg_PVECompletePush implements IHandle<PlayerInfoSimple, PushPVEComplete> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：PUSH_PVECOMPLETE (15003) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.PUSH_PVECOMPLETE;

  Handle(req: PlayerInfoSimple): PushPVEComplete {
    throw new Error('Handle not implemented: NetMsg_PVECompletePush');
  }
}
