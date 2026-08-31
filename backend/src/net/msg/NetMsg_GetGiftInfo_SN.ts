// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_GetGiftInfo_SN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  GetGiftInfoResponse,
} from 'mc-local-share';

/**
 * NetMsg_GetGiftInfo_SN
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = GetGiftInfoResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10023
 */
export class NetMsg_GetGiftInfo_SN implements IHandle<PlayerInfoSimple, GetGiftInfoResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：GET_GIFTINFO_REP (10023) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GET_GIFTINFO_REP;

  Handle(req: PlayerInfoSimple): GetGiftInfoResponse {
    throw new Error('Handle not implemented: NetMsg_GetGiftInfo_SN');
  }
}
