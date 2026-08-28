// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ChampGetResultReward_CS

import { IHandle } from '../IHandle';
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
export class NetMsg_ChampGetResultReward_CS implements IHandle<ChampGetRankRewardRequest, ChampGetRankRewardResponse> {
  /** 请求消息号：CHAMP_GET_RANKREWARD_REQ (10408) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.CHAMP_GET_RANKREWARD_REQ;
  /** 响应消息号：CHAMP_GET_RANKREWARD_REP (10409) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.CHAMP_GET_RANKREWARD_REP;

  Handle(req: ChampGetRankRewardRequest): ChampGetRankRewardResponse {
    throw new Error('Handle not implemented: NetMsg_ChampGetResultReward_CS');
  }
}
