// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_GildingReq

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  GildingResponse,
} from 'mc-local-share';

/**
 * NetMsg_GildingReq
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = GildingResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10431
 */
export class NetMsg_GildingRep implements IHandle<PlayerInfoSimple, GildingResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：GILDING_REP (10431) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GILDING_REP;

  Handle(req: PlayerInfoSimple): GildingResponse {
    throw new Error('Handle not implemented: NetMsg_GildingReq');
  }
}
