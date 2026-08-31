// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_Timeout_SN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
} from 'mc-local-share';

/**
 * NetMsg_Timeout_SN
 * REQ = {}
 * RES = {}
 * 注册：reqId=0、recId=8
 */
export class NetMsg_Timeout_SN extends MessageBase<{}, {}> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：TIMEOUT (8) */
  recId: MESSAGE_ID = MESSAGE_ID.TIMEOUT;

  override Handle(req: {}): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_Timeout_SN');
    }
    return resobj
  }
}
