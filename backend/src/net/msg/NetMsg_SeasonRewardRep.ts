// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_LadderSeasonRewardRep

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  SeasonRewardResponse,
} from 'mc-local-share';

/**
 * NetMsg_LadderSeasonRewardRep
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = SeasonRewardResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10018
 */
export class NetMsg_SeasonRewardRep implements IHandle<PlayerInfoSimple, SeasonRewardResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：SEASON_REWARD_REP (10018) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.SEASON_REWARD_REP;

  Handle(req: PlayerInfoSimple): SeasonRewardResponse {
    throw new Error('Handle not implemented: NetMsg_LadderSeasonRewardRep');
  }
}
