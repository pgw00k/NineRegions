// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_CS_StartMatchPVP

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  MatchLadderRoomRequest,
  MatchLadderRoomResponse,
} from 'mc-local-share';

/**
 * NetMsg_CS_StartMatchPVP
 * REQ = MatchLadderRoomRequest
 * RES = MatchLadderRoomResponse
 * 注册：reqId=10015、recId=10016
 */
export class NetMsg_StartMatchPVP_CS implements IHandle<MatchLadderRoomRequest, MatchLadderRoomResponse> {
  /** 请求消息号：MATCH_LADDERROOM_REQ (10015) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.MATCH_LADDERROOM_REQ;
  /** 响应消息号：MATCH_LADDERROOM_REP (10016) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.MATCH_LADDERROOM_REP;

  Handle(req: MatchLadderRoomRequest): MatchLadderRoomResponse {
    throw new Error('Handle not implemented: NetMsg_CS_StartMatchPVP');
  }
}
