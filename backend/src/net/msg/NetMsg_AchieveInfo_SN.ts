// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Achieve_InfoRes

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  GetAchieveInfoResponse,
} from 'mc-local-share';

/**
 * Achieve_InfoRes
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = GetAchieveInfoResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10231
 */
export class NetMsg_AchieveInfo_SN implements IHandle<PlayerInfoSimple, GetAchieveInfoResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：GET_ACHIEVE_INFO_REP (10231) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GET_ACHIEVE_INFO_REP;

  Handle(req: PlayerInfoSimple): GetAchieveInfoResponse {
    throw new Error('Handle not implemented: Achieve_InfoRes');
  }
}
