// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_LadderSeasonRewardReq

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  SeasonRewardRequest,
} from 'mc-local-share';

/**
 * NetMsg_LadderSeasonRewardReq
 * REQ = SeasonRewardRequest
 * RES = {}
 * 注册：reqId=10017,recId=0
 */
export class NetMsg_SeasonRewardReq extends MessageBase<SeasonRewardRequest, {}> {
  /** 请求消息号：SEASON_REWARD_REQ (10017) */
  reqId: MESSAGE_ID = MESSAGE_ID.SEASON_REWARD_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override HandleSync(req: SeasonRewardRequest, client?: Client, uid?: string, token?: string,exData?:any): {} {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_LadderSeasonRewardReq');
    }
    return resobj
  }
}
