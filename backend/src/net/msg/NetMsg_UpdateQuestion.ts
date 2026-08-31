// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_UpdateQuestion

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  UpdateQuestionnaireRequest,
} from 'mc-local-share';

/**
 * NetMsg_UpdateQuestion
 * REQ = UpdateQuestionnaireRequest
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=15016、recId=-1
 */
export class NetMsg_UpdateQuestion implements IHandle<UpdateQuestionnaireRequest, {}> {
  /** 请求消息号：UPDATE_QUESTION_REQ (15016) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.UPDATE_QUESTION_REQ;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: UpdateQuestionnaireRequest): {} {
    throw new Error('Handle not implemented: NetMsg_UpdateQuestion');
  }
}
