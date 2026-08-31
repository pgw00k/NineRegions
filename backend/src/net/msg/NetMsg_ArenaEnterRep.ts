// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ArenaEnterRep

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  ArenaEnterResponse,
} from 'mc-local-share';

/**
 * NetMsg_ArenaEnterRep
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = ArenaEnterResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10061
 */
export class NetMsg_ArenaEnterRep implements IHandle<PlayerInfoSimple, ArenaEnterResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：ARENA_ENTER_REP (10061) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.ARENA_ENTER_REP;

  Handle(req: PlayerInfoSimple): ArenaEnterResponse {
    throw new Error('Handle not implemented: NetMsg_ArenaEnterRep');
  }
}
