// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ActivityInfoRep_SN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  GetActitiviesResponse,
} from 'mc-local-share';

/**
 * NetMsg_ActivityInfoRep_SN
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = GetActitiviesResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10205
 */
export class NetMsg_ActivityInfoRep_SN implements IHandle<PlayerInfoSimple, GetActitiviesResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：GET_ACTIVITIES_REP (10205) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GET_ACTIVITIES_REP;

  Handle(req: PlayerInfoSimple): GetActitiviesResponse {
    throw new Error('Handle not implemented: NetMsg_ActivityInfoRep_SN');
  }
}
