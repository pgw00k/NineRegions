// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_LadderSeasonRewardRep

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  SeasonRewardResponse,
} from 'mc-local-share';

/**
 * NetMsg_LadderSeasonRewardRep
 * REQ = {}
 * RES = SeasonRewardResponse
 * 注册：reqId=0、recId=10018
 */
export class NetMsg_SeasonRewardRep extends MessageBase<{}, SeasonRewardResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：SEASON_REWARD_REP (10018) */
  recId: MESSAGE_ID = MESSAGE_ID.SEASON_REWARD_REP;

  override Handle(req: {}): SeasonRewardResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_LadderSeasonRewardRep');
    }
    return resobj
  }
}
