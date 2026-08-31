// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_Ping_CN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
} from 'mc-local-share';

/**
 * NetMsg_Ping_CN
 * REQ = {}
 * RES = {}
 * 注册：reqId=7、recId=0
 */
export class NetMsg_Ping_CN extends MessageBase<{}, {}> {
  /** 请求消息号：PINGPONG (7) */
  reqId: MESSAGE_ID = MESSAGE_ID.PINGPONG;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: {}): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_Ping_CN');
    }
    return resobj
  }
}
