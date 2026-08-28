// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ActivityRMBBuy_PUSH

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  GetActivityRewardResponse,
} from 'mc-local-share';

/**
 * NetMsg_ActivityRMBBuy_PUSH
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = GetActivityRewardResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15048
 */
export class NetMsg_ActivityRMBBuy_PUSH implements IHandle<PlayerInfoSimple, GetActivityRewardResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：ACT_RMB_BUY_PUSH (15048) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.ACT_RMB_BUY_PUSH;

  Handle(req: PlayerInfoSimple): GetActivityRewardResponse {
    throw new Error('Handle not implemented: NetMsg_ActivityRMBBuy_PUSH');
  }
}
