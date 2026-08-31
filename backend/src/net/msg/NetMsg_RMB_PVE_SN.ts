// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_RMB_PVE_SN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  PveBuyPush,
} from 'mc-local-share';

/**
 * NetMsg_RMB_PVE_SN
 * REQ = {}
 * RES = PveBuyPush
 * 注册：reqId=0、recId=15045
 */
export class NetMsg_RMB_PVE_SN extends MessageBase<{}, PveBuyPush> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：PVE_BUY_PUSH (15045) */
  recId: MESSAGE_ID = MESSAGE_ID.PVE_BUY_PUSH;

  override Handle(req: {}): PveBuyPush {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_RMB_PVE_SN');
    }
    return resobj
  }
}
