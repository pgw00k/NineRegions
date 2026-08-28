// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Mission_BoxReward

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  TaskPointRewardRequest,
  TaskPointRewardResponse,
} from 'mc-local-share';

/**
 * Mission_BoxReward
 * REQ = TaskPointRewardRequest
 * RES = TaskPointRewardResponse
 * 注册：reqId=10056、recId=10057
 */
export class NetMsg_MissionBoxReward implements IHandle<TaskPointRewardRequest, TaskPointRewardResponse> {
  /** 请求消息号：TASK_POINTREWARD_REQ (10056) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.TASK_POINTREWARD_REQ;
  /** 响应消息号：TASK_POINTREWARD_REP (10057) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.TASK_POINTREWARD_REP;

  Handle(req: TaskPointRewardRequest): TaskPointRewardResponse {
    throw new Error('Handle not implemented: Mission_BoxReward');
  }
}
