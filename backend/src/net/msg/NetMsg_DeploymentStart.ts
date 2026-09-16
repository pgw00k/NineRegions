// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: DeploymentStart

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  DeploymentStartResponse,
} from 'mc-local-share';

/**
 * DeploymentStart
 * REQ = {}
 * RES = DeploymentStartResponse
 * 注册：reqId=0,recId=25005
 */
export class NetMsg_DeploymentStart extends MessageBase<{}, DeploymentStartResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：DEPLOYMENT_START_REP (25005) */
  recId: MESSAGE_ID = MESSAGE_ID.DEPLOYMENT_START_REP;

  override HandleSync(req: {}, client?: Client, uid?: string, token?: string,exData?:any): DeploymentStartResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: DeploymentStart');
    }
    return resobj
  }
}
