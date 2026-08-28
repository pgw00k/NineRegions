// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Mission_ReqInfo

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  TaskDataRequest,
} from 'mc-local-share';

/**
 * Mission_ReqInfo
 * REQ = TaskDataRequest
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=10058、recId=-1
 */
export class NetMsg_MissionInfoReq implements IHandle<TaskDataRequest, {}> {
  /** 请求消息号：TASK_DATA_REQ (10058) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.TASK_DATA_REQ;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: TaskDataRequest): {} {
    throw new Error('Handle not implemented: Mission_ReqInfo');
  }
}
