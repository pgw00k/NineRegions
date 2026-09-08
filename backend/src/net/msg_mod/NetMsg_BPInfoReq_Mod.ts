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
  override HandleSync(req: BattlePassRequest): BattlePassResponse|any {
    Logger.LogInfo('NetMsg_BPInfoReq_Mod.Handle', req);
    
    // 模拟返回战令数据
    const fakeBattlePassData = {
      level: 15,
      exp: 2500,
      totalExp: 3000,
      rewards: [
        { id: 1, status: 1, rewardType: 1, count: 50 },
        { id: 2, status: 0, rewardType: 2, count: 100 },
        { id: 3, status: 0, rewardType: 3, count: 20 }
      ],
      progress: 83,
      activeTask: {
        id: 101,
        type: 1,
        target: 500,
        current: 375
      },
      tasks: [
        { taskId: 1, status: 1, progress: 100, count: 100 },
        { taskId: 2, status: 0, progress: 40, count: 100 }
      ]
    };

    return {
      ...fakeBattlePassData
    };
  }
}
