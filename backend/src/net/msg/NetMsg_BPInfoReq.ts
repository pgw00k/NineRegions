// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: BP_ReqInfo

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  BattlePassRequest,
} from 'mc-local-share';

/**
 * BP_ReqInfo
 * REQ = BattlePassRequest
 * RES = {}
 * 注册：reqId=10280,recId=0
 */
export class NetMsg_BPInfoReq extends MessageBase<BattlePassRequest, {}> {
  /** 请求消息号：BATTLEPASS_REQ (10280) */
  reqId: MESSAGE_ID = MESSAGE_ID.BATTLEPASS_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override HandleSync(req: BattlePassRequest, client?: Client, uid?: string, token?: string,exData?:any): {} {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: BP_ReqInfo');
    }
    return resobj
  }
}
