// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_GetSignInInfo_CN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetSignInInfoRequest,
} from 'mc-local-share';

/**
 * NetMsg_GetSignInInfo_CN
 * REQ = GetSignInInfoRequest
 * RES = {}
 * 注册：reqId=10202、recId=0
 */
export class NetMsg_GetSignInInfo_CN extends MessageBase<GetSignInInfoRequest, {}> {
  /** 请求消息号：GET_SIGNIN_INFO_REQ (10202) */
  reqId: MESSAGE_ID = MESSAGE_ID.GET_SIGNIN_INFO_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: GetSignInInfoRequest): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_GetSignInInfo_CN');
    }
    return resobj
  }
}
