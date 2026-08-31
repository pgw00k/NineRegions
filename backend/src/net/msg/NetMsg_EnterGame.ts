// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_EnterGame

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  EnterGameRequest,
  EnterGameResponse,
} from 'mc-local-share';

/**
 * NetMsg_EnterGame
 * REQ = EnterGameRequest
 * RES = EnterGameResponse
 * 注册：reqId=10001、recId=10002
 */
export class NetMsg_EnterGame extends MessageBase<EnterGameRequest, EnterGameResponse> {
  /** 请求消息号：ENTER_GAME_REQ (10001) */
  reqId: MESSAGE_ID = MESSAGE_ID.ENTER_GAME_REQ;
  /** 响应消息号：ENTER_GAME_REP (10002) */
  recId: MESSAGE_ID = MESSAGE_ID.ENTER_GAME_REP;

  override Handle(req: EnterGameRequest): EnterGameResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_EnterGame');
    }
    return resobj
  }
}
