// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Guide_RecordRep

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GuiderUpdateResponse,
} from 'mc-local-share';

/**
 * Guide_RecordRep
 * REQ = {}
 * RES = GuiderUpdateResponse
 * 注册：reqId=0,recId=10311
 */
export class NetMsg_GuideRecordRep extends MessageBase<{}, GuiderUpdateResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：GUIDER_UPDATE_REP (10311) */
  recId: MESSAGE_ID = MESSAGE_ID.GUIDER_UPDATE_REP;

  override HandleSync(req: {}, client?: Client): GuiderUpdateResponse {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: Guide_RecordRep');
    }
    return resobj
  }
}
