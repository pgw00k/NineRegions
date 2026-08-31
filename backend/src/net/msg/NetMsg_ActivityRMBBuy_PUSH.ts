// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ActivityRMBBuy_PUSH

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetActivityRewardResponse,
} from 'mc-local-share';

/**
 * NetMsg_ActivityRMBBuy_PUSH
 * REQ = {}
 * RES = GetActivityRewardResponse
 * 注册：reqId=0、recId=15048
 */
export class NetMsg_ActivityRMBBuy_PUSH extends MessageBase<{}, GetActivityRewardResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：ACT_RMB_BUY_PUSH (15048) */
  recId: MESSAGE_ID = MESSAGE_ID.ACT_RMB_BUY_PUSH;

  override Handle(req: {}): GetActivityRewardResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_ActivityRMBBuy_PUSH');
    }
    return resobj
  }
}
