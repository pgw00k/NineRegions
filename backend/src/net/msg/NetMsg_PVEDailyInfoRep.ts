// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_PVEDailyInfoRep

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  GetDailyPveInfoResponse,
} from 'mc-local-share';

/**
 * NetMsg_PVEDailyInfoRep
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = GetDailyPveInfoResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10136
 */
export class NetMsg_PVEDailyInfoRep implements IHandle<PlayerInfoSimple, GetDailyPveInfoResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：GET_DAILYPVEINFO_REP (10136) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GET_DAILYPVEINFO_REP;

  Handle(req: PlayerInfoSimple): GetDailyPveInfoResponse {
    throw new Error('Handle not implemented: NetMsg_PVEDailyInfoRep');
  }
}
