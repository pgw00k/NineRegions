// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_CS_StartMatchPVP

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  MatchLadderRoomRequest,
  MatchLadderRoomResponse,
} from 'mc-local-share';

/**
 * NetMsg_CS_StartMatchPVP
 * REQ = MatchLadderRoomRequest
 * RES = MatchLadderRoomResponse
 * 注册：reqId=10015,recId=10016
 */
export class NetMsg_StartMatchPVP_CS extends MessageBase<MatchLadderRoomRequest, MatchLadderRoomResponse> {
  /** 请求消息号：MATCH_LADDERROOM_REQ (10015) */
  reqId: MESSAGE_ID = MESSAGE_ID.MATCH_LADDERROOM_REQ;
  /** 响应消息号：MATCH_LADDERROOM_REP (10016) */
  recId: MESSAGE_ID = MESSAGE_ID.MATCH_LADDERROOM_REP;

  override HandleSync(req: MatchLadderRoomRequest, client?: Client, uid?: string, token?: string,exData?:any): MatchLadderRoomResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_CS_StartMatchPVP');
    }
    return resobj
  }
}
