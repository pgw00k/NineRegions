import {
  CancelMatchRequest,
  CancelMatchResponse,
  ErrorCode,
} from 'mc-local-share';
import { Logger } from '../../core/Logger';
import { Client } from '../Client';
import { NetMsg_CancelMatch_CS } from '../msg/NetMsg_CancelMatch_CS';

/**
 * StartMatchPVP_CS
 */
export class NetMsg_CancelMatch_CS_Mod extends NetMsg_CancelMatch_CS {

  override async Handle(req: CancelMatchRequest, client?: Client, uid?: string, token?: string, exData?: any): Promise<CancelMatchResponse> {
    Logger.LogInfo('CancelMatch_CS_Mod.Handle', req);

    return {
      error: ErrorCode.SUCCESS,
    }
  }
}