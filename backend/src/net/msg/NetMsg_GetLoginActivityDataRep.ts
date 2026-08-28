// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_GetLoginActivityDataRep

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  GetLoginActivityDataRep,
} from 'mc-local-share';

/**
 * NetMsg_GetLoginActivityDataRep
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = GetLoginActivityDataRep
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10341
 */
export class NetMsg_GetLoginActivityDataRep implements IHandle<PlayerInfoSimple, GetLoginActivityDataRep> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：GET_LOGIN_ACTIVITY_REP (10341) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GET_LOGIN_ACTIVITY_REP;

  Handle(req: PlayerInfoSimple): GetLoginActivityDataRep {
    throw new Error('Handle not implemented: NetMsg_GetLoginActivityDataRep');
  }
}
