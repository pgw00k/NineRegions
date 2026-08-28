// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Mission_Reward

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  TaskRewardRequest,
  TaskRewardResponse,
} from 'mc-local-share';

/**
 * Mission_Reward
 * REQ = TaskRewardRequest
 * RES = TaskRewardResponse
 * 注册：reqId=10030、recId=10031
 */
export class NetMsg_MissionReward implements IHandle<TaskRewardRequest, TaskRewardResponse> {
  /** 请求消息号：TASK_REWARD_REQ (10030) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.TASK_REWARD_REQ;
  /** 响应消息号：TASK_REWARD_REP (10031) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.TASK_REWARD_REP;

  Handle(req: TaskRewardRequest): TaskRewardResponse {
    throw new Error('Handle not implemented: Mission_Reward');
  }
}
