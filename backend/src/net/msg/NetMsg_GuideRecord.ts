// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Guide_Record

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GuiderUpdateRequest,
} from 'mc-local-share';

/**
 * Guide_Record
 * REQ = GuiderUpdateRequest
 * RES = {}
 * 注册：reqId=10310、recId=0
 */
export class NetMsg_GuideRecord extends MessageBase<GuiderUpdateRequest, {}> {
  /** 请求消息号：GUIDER_UPDATE_REQ (10310) */
  reqId: MESSAGE_ID = MESSAGE_ID.GUIDER_UPDATE_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: GuiderUpdateRequest): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Guide_Record');
    }
    return resobj
  }
}
