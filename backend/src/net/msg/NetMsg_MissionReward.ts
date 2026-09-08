// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Mission_Reward

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  TaskRewardRequest,
  TaskRewardResponse,
} from 'mc-local-share';

/**
 * Mission_Reward
 * REQ = TaskRewardRequest
 * RES = TaskRewardResponse
 * 注册：reqId=10030,recId=10031
 */
export class NetMsg_MissionReward extends MessageBase<TaskRewardRequest, TaskRewardResponse> {
  /** 请求消息号：TASK_REWARD_REQ (10030) */
  reqId: MESSAGE_ID = MESSAGE_ID.TASK_REWARD_REQ;
  /** 响应消息号：TASK_REWARD_REP (10031) */
  recId: MESSAGE_ID = MESSAGE_ID.TASK_REWARD_REP;

  override HandleSync(req: TaskRewardRequest, client?: Client, uid?: string, token?: string,exData?:any): TaskRewardResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: Mission_Reward');
    }
    return resobj
  }
}
