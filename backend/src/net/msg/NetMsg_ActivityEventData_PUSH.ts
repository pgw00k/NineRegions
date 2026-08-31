// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ActivityEventData_PUSH

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  ActivityEventDataPush,
} from 'mc-local-share';

/**
 * NetMsg_ActivityEventData_PUSH
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = ActivityEventDataPush
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15049
 */
export class NetMsg_ActivityEventData_PUSH implements IHandle<PlayerInfoSimple, ActivityEventDataPush> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：ACT_EVENT_DATA_PUSH (15049) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.ACT_EVENT_DATA_PUSH;

  Handle(req: PlayerInfoSimple): ActivityEventDataPush {
    throw new Error('Handle not implemented: NetMsg_ActivityEventData_PUSH');
  }
}
