// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_GetQuestion

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GetQuestionnaireRequest,
  GetQuestionnaireResponse,
} from 'mc-local-share';

/**
 * NetMsg_GetQuestion
 * REQ = GetQuestionnaireRequest
 * RES = GetQuestionnaireResponse
 * 注册：reqId=10220,recId=10221
 */
export class NetMsg_GetQuestion extends MessageBase<GetQuestionnaireRequest, GetQuestionnaireResponse> {
  /** 请求消息号：GET_QUESTION_REQ (10220) */
  reqId: MESSAGE_ID = MESSAGE_ID.GET_QUESTION_REQ;
  /** 响应消息号：GET_QUESTION_REP (10221) */
  recId: MESSAGE_ID = MESSAGE_ID.GET_QUESTION_REP;

  override HandleSync(req: GetQuestionnaireRequest, client?: Client): GetQuestionnaireResponse {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_GetQuestion');
    }
    return resobj
  }
}
