// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ChampGetResultReward_CS

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ChampGetRankRewardRequest,
  ChampGetRankRewardResponse,
} from 'mc-local-share';

/**
 * NetMsg_ChampGetResultReward_CS
 * REQ = ChampGetRankRewardRequest
 * RES = ChampGetRankRewardResponse
 * 注册：reqId=10408、recId=10409
 */
export class NetMsg_ChampGetResultReward_CS extends MessageBase<ChampGetRankRewardRequest, ChampGetRankRewardResponse> {
  /** 请求消息号：CHAMP_GET_RANKREWARD_REQ (10408) */
  reqId: MESSAGE_ID = MESSAGE_ID.CHAMP_GET_RANKREWARD_REQ;
  /** 响应消息号：CHAMP_GET_RANKREWARD_REP (10409) */
  recId: MESSAGE_ID = MESSAGE_ID.CHAMP_GET_RANKREWARD_REP;

  override Handle(req: ChampGetRankRewardRequest): ChampGetRankRewardResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_ChampGetResultReward_CS');
    }
    return resobj
  }
}
