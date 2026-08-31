// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Mission_InfoRec

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  TaskDataResponse,
} from 'mc-local-share';

/**
 * Mission_InfoRec
 * REQ = {}
 * RES = TaskDataResponse
 * 注册：reqId=0、recId=10059
 */
export class NetMsg_MissionInfoRec extends MessageBase<{}, TaskDataResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：TASK_DATA_REP (10059) */
  recId: MESSAGE_ID = MESSAGE_ID.TASK_DATA_REP;

  override Handle(req: {}): TaskDataResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Mission_InfoRec');
    }
    return resobj
  }
}
