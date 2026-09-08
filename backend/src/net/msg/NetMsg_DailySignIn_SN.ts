// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_DailySignIn_SN

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  DailySignInResponse,
} from 'mc-local-share';

/**
 * NetMsg_DailySignIn_SN
 * REQ = {}
 * RES = DailySignInResponse
 * 注册：reqId=0,recId=10201
 */
export class NetMsg_DailySignIn_SN extends MessageBase<{}, DailySignInResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：DAILY_SIGNIN_REP (10201) */
  recId: MESSAGE_ID = MESSAGE_ID.DAILY_SIGNIN_REP;

  override HandleSync(req: {}, client?: Client, uid?: string, token?: string,exData?:any): DailySignInResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_DailySignIn_SN');
    }
    return resobj
  }
}
