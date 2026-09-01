// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_EnterGame

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  EnterGameRequest,
  EnterGameResponse,
} from 'mc-local-share';
import { NetMsg_EnterGame } from '../msg/NetMsg_EnterGame';
import { Logger } from '../../core/Logger';
import { Client } from '../Client';

/**
 * NetMsg_EnterGame
 * REQ = EnterGameRequest
 * RES = EnterGameResponse
 * 注册：reqId=10001、recId=10002
 */
export class NetMsg_EnterGame_Mod extends NetMsg_EnterGame {
  override Handle(req: EnterGameRequest, client?: Client): EnterGameResponse {
    Logger.LogInfo('EnterGame_Mod.Handle', client ? { ...req, uid: client.uid } : req);
    return super.Handle(req);
  }
}
