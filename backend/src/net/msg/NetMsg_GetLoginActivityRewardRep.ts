// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_GetLoginActivityRewardRep

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  GetLoginActivityRewardRep,
} from 'mc-local-share';

/**
 * NetMsg_GetLoginActivityRewardRep
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = GetLoginActivityRewardRep
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10343
 */
export class NetMsg_GetLoginActivityRewardRep implements IHandle<PlayerInfoSimple, GetLoginActivityRewardRep> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：GET_LOGIN_ACTIVITY_REWARD_REP (10343) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GET_LOGIN_ACTIVITY_REWARD_REP;

  Handle(req: PlayerInfoSimple): GetLoginActivityRewardRep {
    throw new Error('Handle not implemented: NetMsg_GetLoginActivityRewardRep');
  }
}
