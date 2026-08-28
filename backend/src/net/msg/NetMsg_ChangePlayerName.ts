// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ChangePlayerName

import { IHandle } from '../IHandle';
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
export class NetMsg_ChangePlayerName implements IHandle<ChangePlayerNameRequest, ChangePlayerNameResponse> {
  /** 请求消息号：CHANGE_PLAYERNAME_REQ (10450) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.CHANGE_PLAYERNAME_REQ;
  /** 响应消息号：CHANGE_PLAYERNAME_REP (10451) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.CHANGE_PLAYERNAME_REP;

  Handle(req: ChangePlayerNameRequest): ChangePlayerNameResponse {
    throw new Error('Handle not implemented: NetMsg_ChangePlayerName');
  }
}
