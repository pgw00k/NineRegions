// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Achieve_InfoReq

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetAchieveInfoRequest,
} from 'mc-local-share';

/**
 * Achieve_InfoReq
 * REQ = GetAchieveInfoRequest
 * RES = {}
 * 注册：reqId=10230,recId=0
 */
export class NetMsg_AchieveInfo_CN extends MessageBase<GetAchieveInfoRequest, {}> {
  /** 请求消息号：GET_ACHIEVE_INFO_REQ (10230) */
  reqId: MESSAGE_ID = MESSAGE_ID.GET_ACHIEVE_INFO_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override HandleSync(req: GetAchieveInfoRequest, client?: Client): {} {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: Achieve_InfoReq');
    }
    return resobj
  }
}
