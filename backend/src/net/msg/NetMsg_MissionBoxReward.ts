// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Mission_BoxReward

import { MessageBase } from '../MessageBase';
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
export class NetMsg_MissionBoxReward extends MessageBase<TaskPointRewardRequest, TaskPointRewardResponse> {
  /** 请求消息号：TASK_POINTREWARD_REQ (10056) */
  reqId: MESSAGE_ID = MESSAGE_ID.TASK_POINTREWARD_REQ;
  /** 响应消息号：TASK_POINTREWARD_REP (10057) */
  recId: MESSAGE_ID = MESSAGE_ID.TASK_POINTREWARD_REP;

  override Handle(req: TaskPointRewardRequest): TaskPointRewardResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Mission_BoxReward');
    }
    return resobj
  }
}
