// tagName: NetMsg_EnterGame

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  EnterGameRequest,
  EnterGameResponse,
  ErrorCode,
} from 'mc-local-share';
import { NetMsg_EnterGame } from '../msg/NetMsg_EnterGame';
import { Logger } from '../../core/Logger';
import { Client } from '../Client';
import { PlayerService } from '../../database/service/Player.service';

/**
 * NetMsg_EnterGame
 * REQ = EnterGameRequest
 * RES = EnterGameResponse
 * 注册：reqId=10001,recId=10002
 */
export class NetMsg_EnterGame_Mod extends NetMsg_EnterGame {
  override async Handle(req: EnterGameRequest, client?: Client): Promise<EnterGameResponse> {
    let uid = req.uid || client?.uid || undefined;
    let res: EnterGameResponse={
        error: ErrorCode.ACCOUNT_NOT_EXISTS,
        activity: [],
        achieveInfo: [],
        heroEquips: [],
        loginActivity: [],
        shopInfo: [],
    }
    console.log(`EnterGame_Mod.HandleSync uid=${uid}`);
    if (!uid) {
      return Promise.resolve(res);
    }
    let player = await PlayerService.Instance.GetPlayerByID(uid);
    if (!player) {
      return Promise.resolve(res);
    }
    let resOrignal = await super.Handle(req, client);

    if(resOrignal) {
      Object.assign(resOrignal.playerInfo!,player);
    }

    return resOrignal;
  }
}
