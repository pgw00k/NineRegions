// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_EnterGame

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  BattlePassRequest,
  BattlePassResponse
} from 'mc-local-share';
import { NetMsg_BPInfoReq } from '../msg/NetMsg_BPInfoReq';
import { Logger } from '../../core/Logger';

/**
 * NetMsg_BPInfoReq
 * REQ = BattlePassRequest
 * RES = {}
 * 注册：reqId=10280,recId=10281
 */
export class NetMsg_BPInfoReq_Mod extends NetMsg_BPInfoReq {
  /** 请求消息号：BATTLEPASS_REQ (10280) */
  reqId: MESSAGE_ID = MESSAGE_ID.BATTLEPASS_REQ;
  /** 响应消息号：BATTLEPASS_REP (10281) */
  recId: MESSAGE_ID = MESSAGE_ID.BATTLEPASS_REP;
  override Handle(req: BattlePassRequest): BattlePassResponse|any {
    return super.Handle(req);
  }
}
