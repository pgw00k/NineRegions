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
import { DeckService } from '../../database/service/Deck.service';
import { CardLibraryService } from '../../database/service/CardLibrary.service';
import { PlayerBaseService } from '../../database/service/PlayerBase.service';
import { BattleServer } from '../../Battle/BattleServer';

/**
 * NetMsg_EnterGame
 * REQ = EnterGameRequest
 * RES = EnterGameResponse
 * 注册：reqId=10001,recId=10002
 */
export class NetMsg_EnterGame_Mod extends NetMsg_EnterGame {
  override async Handle(req: EnterGameRequest, client?: Client, uid?: string, token?: string, exData?: any): Promise<EnterGameResponse> {
    let suid = uid || req.uid || client?.uid;
    let res: EnterGameResponse = {
      error: ErrorCode.ACCOUNT_NOT_EXISTS,
      activity: [],
      achieveInfo: [],
      heroEquips: [],
      loginActivity: [],
      shopInfo: [],
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
      ...this.PendingBattle(suid),
    }
    return Promise.resolve(res);
  }

  /**
   * 有一场没打完的战斗时回填 battle* 字段。
   *
   * 客户端 Lua（NetMsg_EnterGame.lua 的 OnReceive）用它决定「进主城」还是「回战场」：
   * `BattleDataInterface.ReLoginBattleProcedure(battleRoomType, battleAccountToken,
   * battleRoomToken, battleResult)` —— roomType 映射不到本地战斗类型、或两个 token
   * 任一为空，就直接 return false 进主城。所以这里必须三个字段一起给齐。
   */
  private PendingBattle(uid: string): Partial<EnterGameResponse> {
    return BattleServer.Instance.GetPendingBattle(uid) ?? {};
  }
}
