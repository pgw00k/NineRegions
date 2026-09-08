// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_GetSignInInfo_SN

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetSignInInfoResponse,
} from 'mc-local-share';

/**
 * NetMsg_GetSignInInfo_SN
 * REQ = {}
 * RES = GetSignInInfoResponse
 * 注册：reqId=0,recId=10203
 */
export class NetMsg_GetSignInInfo_SN extends MessageBase<{}, GetSignInInfoResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：GET_SIGNIN_INFO_REP (10203) */
  recId: MESSAGE_ID = MESSAGE_ID.GET_SIGNIN_INFO_REP;

  override HandleSync(req: {}, client?: Client, uid?: string, token?: string,exData?:any): GetSignInInfoResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_GetSignInInfo_SN');
    }
    return resobj
  }
}
