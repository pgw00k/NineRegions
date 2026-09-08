// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Mission_ReqInfo

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  TaskDataRequest,
} from 'mc-local-share';

/**
 * Mission_ReqInfo
 * REQ = TaskDataRequest
 * RES = {}
 * 注册：reqId=10058,recId=0
 */
export class NetMsg_MissionInfoReq extends MessageBase<TaskDataRequest, {}> {
  /** 请求消息号：TASK_DATA_REQ (10058) */
  reqId: MESSAGE_ID = MESSAGE_ID.TASK_DATA_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override HandleSync(req: TaskDataRequest, client?: Client, uid?: string, token?: string,exData?:any): {} {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: Mission_ReqInfo');
    }
    return resobj
  }
}
