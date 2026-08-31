// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_PushPrizeInfo

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  PushPrizeInfo,
} from 'mc-local-share';

/**
 * NetMsg_PushPrizeInfo
 * REQ = {}
 * RES = PushPrizeInfo
 * 注册：reqId=0、recId=15041
 */
export class NetMsg_PushPrizeInfo extends MessageBase<{}, PushPrizeInfo> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：PUSH_PRIZE_INFO (15041) */
  recId: MESSAGE_ID = MESSAGE_ID.PUSH_PRIZE_INFO;

  override Handle(req: {}): PushPrizeInfo {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_PushPrizeInfo');
    }
    return resobj
  }
}
