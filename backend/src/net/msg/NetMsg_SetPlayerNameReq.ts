// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_SetPlayerName

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  SetPlayerNameRequest,
  SetPlayerNameResponse,
} from 'mc-local-share';

/**
 * NetMsg_SetPlayerName
 * REQ = SetPlayerNameRequest
 * RES = SetPlayerNameResponse
 * 注册：reqId=10047、recId=10048
 */
export class NetMsg_SetPlayerNameReq extends MessageBase<SetPlayerNameRequest, SetPlayerNameResponse> {
  /** 请求消息号：SET_PLAYERNAME_REQ (10047) */
  reqId: MESSAGE_ID = MESSAGE_ID.SET_PLAYERNAME_REQ;
  /** 响应消息号：SET_PLAYERNAME_REP (10048) */
  recId: MESSAGE_ID = MESSAGE_ID.SET_PLAYERNAME_REP;

  override Handle(req: SetPlayerNameRequest): SetPlayerNameResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_SetPlayerName');
    }
    return resobj
  }
}
