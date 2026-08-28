// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Mission_InfoRec

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  TaskDataResponse,
} from 'mc-local-share';

/**
 * Mission_InfoRec
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = TaskDataResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10059
 */
export class NetMsg_MissionInfoRec implements IHandle<PlayerInfoSimple, TaskDataResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：TASK_DATA_REP (10059) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.TASK_DATA_REP;

  Handle(req: PlayerInfoSimple): TaskDataResponse {
    throw new Error('Handle not implemented: Mission_InfoRec');
  }
}
