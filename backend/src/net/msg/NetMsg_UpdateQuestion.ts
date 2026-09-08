// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_UpdateQuestion

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  UpdateQuestionnaireRequest,
} from 'mc-local-share';

/**
 * NetMsg_UpdateQuestion
 * REQ = UpdateQuestionnaireRequest
 * RES = {}
 * 注册：reqId=15016,recId=0
 */
export class NetMsg_UpdateQuestion extends MessageBase<UpdateQuestionnaireRequest, {}> {
  /** 请求消息号：UPDATE_QUESTION_REQ (15016) */
  reqId: MESSAGE_ID = MESSAGE_ID.UPDATE_QUESTION_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override HandleSync(req: UpdateQuestionnaireRequest, client?: Client, uid?: string, token?: string,exData?:any): {} {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_UpdateQuestion');
    }
    return resobj
  }
}
