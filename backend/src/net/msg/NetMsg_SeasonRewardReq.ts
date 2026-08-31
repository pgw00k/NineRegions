// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_LadderSeasonRewardReq

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  SeasonRewardRequest,
} from 'mc-local-share';

/**
 * NetMsg_LadderSeasonRewardReq
 * REQ = SeasonRewardRequest
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=10017、recId=-1
 */
export class NetMsg_SeasonRewardReq implements IHandle<SeasonRewardRequest, {}> {
  /** 请求消息号：SEASON_REWARD_REQ (10017) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.SEASON_REWARD_REQ;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: SeasonRewardRequest): {} {
    throw new Error('Handle not implemented: NetMsg_LadderSeasonRewardReq');
  }
}
