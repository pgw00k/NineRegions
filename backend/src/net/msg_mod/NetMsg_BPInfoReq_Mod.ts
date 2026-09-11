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
import { AppDataSource } from '../../database/DataSource';
import { Client } from '../Client';

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

  override async Handle(req: BattlePassRequest, client?: Client, uid?: string, token?: string, exData?: any): Promise<BattlePassResponse> {
    let suid = uid || client?.uid;
    let res = {
      info: {
        bpState: false,
        level: 1,
        exp: 0,
        bpPayExp: false,
      },
      freeRewardFlag: [],
      rewardFlag: [],
      quest: [],
    }
    if (!suid) {
      
    }
    return Promise.resolve(res);
  }
}
