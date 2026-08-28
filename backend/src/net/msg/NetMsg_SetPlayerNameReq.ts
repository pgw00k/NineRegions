// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_SetPlayerName

import { IHandle } from '../IHandle';
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
export class NetMsg_SetPlayerNameReq implements IHandle<SetPlayerNameRequest, SetPlayerNameResponse> {
  /** 请求消息号：SET_PLAYERNAME_REQ (10047) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.SET_PLAYERNAME_REQ;
  /** 响应消息号：SET_PLAYERNAME_REP (10048) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.SET_PLAYERNAME_REP;

  Handle(req: SetPlayerNameRequest): SetPlayerNameResponse {
    throw new Error('Handle not implemented: NetMsg_SetPlayerName');
  }
}
