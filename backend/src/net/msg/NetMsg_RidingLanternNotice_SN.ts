// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: RidingLanternNotice

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  AnnounceLamp,
} from 'mc-local-share';

/**
 * RidingLanternNotice
 * REQ = {}
 * RES = AnnounceLamp
 * 注册：reqId=0,recId=10226
 */
export class NetMsg_RidingLanternNotice_SN extends MessageBase<{}, AnnounceLamp> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：ANNOUNCE_LAMP_PUSH (10226) */
  recId: MESSAGE_ID = MESSAGE_ID.ANNOUNCE_LAMP_PUSH;

  override HandleSync(req: {}, client?: Client, uid?: string, token?: string,exData?:any): AnnounceLamp {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: RidingLanternNotice');
    }
    return resobj
  }
}
