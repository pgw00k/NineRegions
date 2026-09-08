// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_UseSkin

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  UseSkinRsp,
} from 'mc-local-share';

/**
 * NetMsg_UseSkin
 * REQ = {}
 * RES = UseSkinRsp
 * 注册：reqId=0,recId=10395
 */
export class NetMsg_UseSkinRsp extends MessageBase<{}, UseSkinRsp> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：USE_SKIN_RSP (10395) */
  recId: MESSAGE_ID = MESSAGE_ID.USE_SKIN_RSP;

  override HandleSync(req: {}, client?: Client): UseSkinRsp {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_UseSkin');
    }
    return resobj
  }
}
