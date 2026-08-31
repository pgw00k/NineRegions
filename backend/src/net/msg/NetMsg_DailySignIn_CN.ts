// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_DailySignIn_CN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  DailySignInRequest,
} from 'mc-local-share';

/**
 * NetMsg_DailySignIn_CN
 * REQ = DailySignInRequest
 * RES = {}
 * 注册：reqId=10200、recId=0
 */
export class NetMsg_DailySignIn_CN extends MessageBase<DailySignInRequest, {}> {
  /** 请求消息号：DAILY_SIGNIN_REQ (10200) */
  reqId: MESSAGE_ID = MESSAGE_ID.DAILY_SIGNIN_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: DailySignInRequest): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_DailySignIn_CN');
    }
    return resobj
  }
}
