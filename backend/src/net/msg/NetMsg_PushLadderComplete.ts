// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_PushLadderComplete

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  PushLadderComplete,
} from 'mc-local-share';

/**
 * NetMsg_PushLadderComplete
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = PushLadderComplete
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15004
 */
export class NetMsg_PushLadderComplete implements IHandle<PlayerInfoSimple, PushLadderComplete> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：PUSH_LADDERCOMPLETE (15004) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.PUSH_LADDERCOMPLETE;

  Handle(req: PlayerInfoSimple): PushLadderComplete {
    throw new Error('Handle not implemented: NetMsg_PushLadderComplete');
  }
}
