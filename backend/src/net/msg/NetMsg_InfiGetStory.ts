// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Infi_GetStory

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  GetInfiStoryRequest,
  GetInfiStoryResponse,
} from 'mc-local-share';

/**
 * Infi_GetStory
 * REQ = GetInfiStoryRequest
 * RES = GetInfiStoryResponse
 * 注册：reqId=10124、recId=10125
 */
export class NetMsg_InfiGetStory implements IHandle<GetInfiStoryRequest, GetInfiStoryResponse> {
  /** 请求消息号：INFI_GET_STORY_REQ (10124) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.INFI_GET_STORY_REQ;
  /** 响应消息号：INFI_GET_STORY_REP (10125) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.INFI_GET_STORY_REP;

  Handle(req: GetInfiStoryRequest): GetInfiStoryResponse {
    throw new Error('Handle not implemented: Infi_GetStory');
  }
}
