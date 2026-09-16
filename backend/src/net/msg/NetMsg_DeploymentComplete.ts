// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: DeploymentComplete

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  DeploymentCompleteRequest,
} from 'mc-local-share';

/**
 * DeploymentComplete
 * REQ = DeploymentCompleteRequest
 * RES = {}
 * 注册：reqId=25006,recId=0
 */
export class NetMsg_DeploymentComplete extends MessageBase<DeploymentCompleteRequest, {}> {
  /** 请求消息号：DEPLOYMENT_COMPLETE_REQ (25006) */
  reqId: MESSAGE_ID = MESSAGE_ID.DEPLOYMENT_COMPLETE_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override HandleSync(req: DeploymentCompleteRequest, client?: Client, uid?: string, token?: string,exData?:any): {} {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: DeploymentComplete');
    }
    return resobj
  }
}
