// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ChangePlayerName

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ChangePlayerNameRequest,
  ChangePlayerNameResponse,
} from 'mc-local-share';

/**
 * NetMsg_ChangePlayerName
 * REQ = ChangePlayerNameRequest
 * RES = ChangePlayerNameResponse
 * 注册：reqId=10450、recId=10451
 */
export class NetMsg_ChangePlayerName extends MessageBase<ChangePlayerNameRequest, ChangePlayerNameResponse> {
  /** 请求消息号：CHANGE_PLAYERNAME_REQ (10450) */
  reqId: MESSAGE_ID = MESSAGE_ID.CHANGE_PLAYERNAME_REQ;
  /** 响应消息号：CHANGE_PLAYERNAME_REP (10451) */
  recId: MESSAGE_ID = MESSAGE_ID.CHANGE_PLAYERNAME_REP;

  override Handle(req: ChangePlayerNameRequest): ChangePlayerNameResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_ChangePlayerName');
    }
    return resobj
  }
}
