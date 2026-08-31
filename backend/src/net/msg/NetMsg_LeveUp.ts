// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_LevelUp

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  PushLevelup,
} from 'mc-local-share';

/**
 * NetMsg_LevelUp
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = PushLevelup
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15005
 */
export class NetMsg_LeveUp implements IHandle<PlayerInfoSimple, PushLevelup> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：PUSH_LEVELUP (15005) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.PUSH_LEVELUP;

  Handle(req: PlayerInfoSimple): PushLevelup {
    throw new Error('Handle not implemented: NetMsg_LevelUp');
  }
}
