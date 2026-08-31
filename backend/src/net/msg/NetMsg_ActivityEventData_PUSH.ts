// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ActivityEventData_PUSH

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ActivityEventDataPush,
} from 'mc-local-share';

/**
 * NetMsg_ActivityEventData_PUSH
 * REQ = {}
 * RES = ActivityEventDataPush
 * 注册：reqId=0、recId=15049
 */
export class NetMsg_ActivityEventData_PUSH extends MessageBase<{}, ActivityEventDataPush> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：ACT_EVENT_DATA_PUSH (15049) */
  recId: MESSAGE_ID = MESSAGE_ID.ACT_EVENT_DATA_PUSH;

  override Handle(req: {}): ActivityEventDataPush {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_ActivityEventData_PUSH');
    }
    return resobj
  }
}
