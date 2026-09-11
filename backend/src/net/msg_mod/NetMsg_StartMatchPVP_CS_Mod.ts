import {
  ErrorCode,
  MatchLadderRoomRequest,
  MatchLadderRoomResponse,
} from 'mc-local-share';
import { Logger } from '../../core/Logger';
import { Client } from '../Client';
import { NetMsg_StartMatchPVP_CS } from '../msg/NetMsg_StartMatchPVP_CS';
import { BattleServer } from '../../Battle/BattleServer';

/**
 * StartMatchPVP_CS
 */
export class NetMsg_StartMatchPVP_CS_Mod extends NetMsg_StartMatchPVP_CS {

  override async Handle(req: MatchLadderRoomRequest, client?: Client, uid?: string, token?: string, exData?: any): Promise<MatchLadderRoomResponse> {
    Logger.LogInfo('StartMatchPVP_CS_Mod.Handle', req);

    BattleServer.Instance.PushClientToMatchQueue(client!,req.did!);

    return {
      error: ErrorCode.SUCCESS,
    }
  }
}