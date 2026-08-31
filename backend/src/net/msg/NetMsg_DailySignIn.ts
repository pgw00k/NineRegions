// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_DailySignIn

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  DailySignInRequest,
  DailySignInResponse,
} from 'mc-local-share';

/**
 * NetMsg_DailySignIn
 * REQ = DailySignInRequest
 * RES = DailySignInResponse
 * 注册：reqId=10200、recId=10201
 */
export class NetMsg_DailySignIn extends MessageBase<DailySignInRequest, DailySignInResponse> {
  /** 请求消息号：DAILY_SIGNIN_REQ (10200) */
  reqId: MESSAGE_ID = MESSAGE_ID.DAILY_SIGNIN_REQ;
  /** 响应消息号：DAILY_SIGNIN_REP (10201) */
  recId: MESSAGE_ID = MESSAGE_ID.DAILY_SIGNIN_REP;

  override Handle(req: DailySignInRequest): DailySignInResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_DailySignIn');
    }
    return resobj
  }
}
