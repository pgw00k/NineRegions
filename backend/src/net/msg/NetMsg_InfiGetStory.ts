// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_GetStory

import { MessageBase } from '../MessageBase';
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
export class NetMsg_InfiGetStory extends MessageBase<GetInfiStoryRequest, GetInfiStoryResponse> {
  /** 请求消息号：INFI_GET_STORY_REQ (10124) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_GET_STORY_REQ;
  /** 响应消息号：INFI_GET_STORY_REP (10125) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_GET_STORY_REP;

  override Handle(req: GetInfiStoryRequest): GetInfiStoryResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Infi_GetStory');
    }
    return resobj
  }
}
