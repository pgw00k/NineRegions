// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_GetQuestion

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  GetQuestionnaireRequest,
  GetQuestionnaireResponse,
} from 'mc-local-share';

/**
 * NetMsg_GetQuestion
 * REQ = GetQuestionnaireRequest
 * RES = GetQuestionnaireResponse
 * 注册：reqId=10220、recId=10221
 */
export class NetMsg_GetQuestion implements IHandle<GetQuestionnaireRequest, GetQuestionnaireResponse> {
  /** 请求消息号：GET_QUESTION_REQ (10220) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.GET_QUESTION_REQ;
  /** 响应消息号：GET_QUESTION_REP (10221) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GET_QUESTION_REP;

  Handle(req: GetQuestionnaireRequest): GetQuestionnaireResponse {
    throw new Error('Handle not implemented: NetMsg_GetQuestion');
  }
}
