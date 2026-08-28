// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ChampGetMatchReward_CS

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  ChampGetWinRewardRequest,
  ChampGetWinRewardResponse,
} from 'mc-local-share';

/**
 * NetMsg_ChampGetMatchReward_CS
 * REQ = ChampGetWinRewardRequest
 * RES = ChampGetWinRewardResponse
 * 注册：reqId=10406、recId=10407
 */
export class NetMsg_ChampGetMatchReward_CS implements IHandle<ChampGetWinRewardRequest, ChampGetWinRewardResponse> {
  /** 请求消息号：CHAMP_GET_WINREWARD_REQ (10406) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.CHAMP_GET_WINREWARD_REQ;
  /** 响应消息号：CHAMP_GET_WINREWARD_REP (10407) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.CHAMP_GET_WINREWARD_REP;

  Handle(req: ChampGetWinRewardRequest): ChampGetWinRewardResponse {
    throw new Error('Handle not implemented: NetMsg_ChampGetMatchReward_CS');
  }
}
