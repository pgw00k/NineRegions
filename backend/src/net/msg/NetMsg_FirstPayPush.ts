// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_FirstPayPush

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  FirstChargePush,
} from 'mc-local-share';

/**
 * NetMsg_FirstPayPush
 * REQ = {}
 * RES = FirstChargePush
 * 注册：reqId=0,recId=15047
 */
export class NetMsg_FirstPayPush extends MessageBase<{}, FirstChargePush> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：FIRSTCHARGE_PUSH (15047) */
  recId: MESSAGE_ID = MESSAGE_ID.FIRSTCHARGE_PUSH;

  override HandleSync(req: {}, client?: Client): FirstChargePush {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_FirstPayPush');
    }
    return resobj
  }
}
