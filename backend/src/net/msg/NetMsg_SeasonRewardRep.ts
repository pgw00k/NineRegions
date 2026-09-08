// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_LadderSeasonRewardRep

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  SeasonRewardResponse,
} from 'mc-local-share';

/**
 * NetMsg_LadderSeasonRewardRep
 * REQ = {}
 * RES = SeasonRewardResponse
 * 注册：reqId=0,recId=10018
 */
export class NetMsg_SeasonRewardRep extends MessageBase<{}, SeasonRewardResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：SEASON_REWARD_REP (10018) */
  recId: MESSAGE_ID = MESSAGE_ID.SEASON_REWARD_REP;

  override HandleSync(req: {}, client?: Client): SeasonRewardResponse {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_LadderSeasonRewardRep');
    }
    return resobj
  }
}
