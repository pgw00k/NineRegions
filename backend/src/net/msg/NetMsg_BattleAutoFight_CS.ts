// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_BattleAutoFight_CS

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  SetAutoDeployRequest,
  SetAutoDeployResponse,
} from 'mc-local-share';

/**
 * NetMsg_BattleAutoFight_CS
 * REQ = SetAutoDeployRequest
 * RES = SetAutoDeployResponse
 * 注册：reqId=20003、recId=20004
 */
export class NetMsg_BattleAutoFight_CS implements IHandle<SetAutoDeployRequest, SetAutoDeployResponse> {
  /** 请求消息号：SET_AUTODEPLOY_REQ (20003) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.SET_AUTODEPLOY_REQ;
  /** 响应消息号：SET_AUTODEPLOY_REP (20004) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.SET_AUTODEPLOY_REP;

  Handle(req: SetAutoDeployRequest): SetAutoDeployResponse {
    throw new Error('Handle not implemented: NetMsg_BattleAutoFight_CS');
  }
}
