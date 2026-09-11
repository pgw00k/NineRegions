import {
  BattleReadyRequest,
  ErrorCode,
  MatchLadderRoomRequest,
  MatchLadderRoomResponse,
} from 'mc-local-share';
import { Logger } from '../../core/Logger';
import { Client } from '../Client';
import { NetMsg_StartMatchPVP_CS } from '../msg/NetMsg_StartMatchPVP_CS';
import { BattleServer } from '../../Battle/BattleServer';
import { NetMsg_BattleReady_CN } from '../msg/NetMsg_BattleReady_CN';

/**
 * BattleReady_CN
 */
export class NetMsg_BattleReady_CN_Mod extends NetMsg_BattleReady_CN {

  override async Handle(req: BattleReadyRequest, client?: Client, uid?: string, token?: string, exData?: any): Promise<any> {
    Logger.LogInfo('BattleReady_CN_Mod.Handle', req);

    BattleServer.Instance.PlayerReady(client!);

    return undefined
  }
}