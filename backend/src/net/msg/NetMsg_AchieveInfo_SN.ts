// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Achieve_InfoRes

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetAchieveInfoResponse,
} from 'mc-local-share';

/**
 * Achieve_InfoRes
 * REQ = {}
 * RES = GetAchieveInfoResponse
 * 注册：reqId=0、recId=10231
 */
export class NetMsg_AchieveInfo_SN extends MessageBase<{}, GetAchieveInfoResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：GET_ACHIEVE_INFO_REP (10231) */
  recId: MESSAGE_ID = MESSAGE_ID.GET_ACHIEVE_INFO_REP;

  override Handle(req: {}): GetAchieveInfoResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Achieve_InfoRes');
    }
    return resobj
  }
}
