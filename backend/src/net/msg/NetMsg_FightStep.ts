// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: FightStep

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  FightStepResponse,
} from 'mc-local-share';

/**
 * FightStep
 * REQ = {}
 * RES = FightStepResponse
 * 注册：reqId=0,recId=25011
 */
export class NetMsg_FightStep extends MessageBase<{}, FightStepResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：FIGHT_STEP_REP (25011) */
  recId: MESSAGE_ID = MESSAGE_ID.FIGHT_STEP_REP;

  override HandleSync(req: {}, client?: Client, uid?: string, token?: string,exData?:any): FightStepResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: FightStep');
    }
    return resobj
  }
}
