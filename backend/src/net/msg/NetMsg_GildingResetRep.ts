// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_GildingResetRep

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  GildingResetResponse,
} from 'mc-local-share';

/**
 * NetMsg_GildingResetRep
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = GildingResetResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10433
 */
export class NetMsg_GildingResetRep implements IHandle<PlayerInfoSimple, GildingResetResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：GILDING_RESET_REP (10433) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GILDING_RESET_REP;

  Handle(req: PlayerInfoSimple): GildingResetResponse {
    throw new Error('Handle not implemented: NetMsg_GildingResetRep');
  }
}
