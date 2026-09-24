// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_EnterGame

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  LogicReconnectionRequest,
  LogicReconnectionResponse,
  ErrorCode,
} from 'mc-local-share';

import { Logger } from '../../core/Logger';
import { Client } from '../Client';
import { NetMsg_MainTownReconnect } from '../msg/NetMsg_MainTownReconnect';
import { PlayerService } from '../../database/service/Player.service';
import { DeckService } from '../../database/service/Deck.service';
import { PlayerBaseService } from '../../database/service/PlayerBase.service';
import { BattleServer } from '../../Battle/BattleServer';

/**
 * NetMsg_LogicReconnection_Mod
 * REQ = LogicReconnectionRequest
 * RES = LogicReconnectionResponse
 * 注册：reqId=10011,recId=10012
 */
export class NetMsg_MainTownReconnect_Mod extends NetMsg_MainTownReconnect {
  reqId: MESSAGE_ID = MESSAGE_ID.LOGIC_RECONNECTION_REQ;

  override async Handle(req: LogicReconnectionRequest, client?: Client, uid?: string, token?: string, exData?: any): Promise<LogicReconnectionResponse> {
    let suid = uid || client?.uid;
    let res: LogicReconnectionResponse = {
      error: ErrorCode.ACCOUNT_NOT_EXISTS,
      index: '',
      data: [],
      heroEquips: [],
      loginActivity: [],
      shopInfo: []
    }
    // console.log(`EnterGame_Mod.HandleSync uid=${suid}`);
    if (!suid) {
      return Promise.resolve(res);
    }
    let playerBase = await PlayerBaseService.Instance.GetPlayerBaseByUID(suid);
    res = {
      ...res,
      error: ErrorCode.SUCCESS,
      ...playerBase,
    }
    return Promise.resolve(res);
  }
}
