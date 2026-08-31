// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Mission_ReqInfo

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  TaskDataRequest,
} from 'mc-local-share';

/**
 * Mission_ReqInfo
 * REQ = TaskDataRequest
 * RES = {}
 * 注册：reqId=10058、recId=0
 */
export class NetMsg_MissionInfoReq extends MessageBase<TaskDataRequest, {}> {
  /** 请求消息号：TASK_DATA_REQ (10058) */
  reqId: MESSAGE_ID = MESSAGE_ID.TASK_DATA_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: TaskDataRequest): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Mission_ReqInfo');
    }
    return resobj
  }
}
