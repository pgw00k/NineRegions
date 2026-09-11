import {
  ChangeCardRequest,
  ChangeCardResponse,
  ErrorCode,
} from 'mc-local-share';
import { Logger } from '../../core/Logger';
import { Client } from '../Client';
import { BattleServer } from '../../Battle/BattleServer';
import { NetMsg_ChangeCard } from '../msg/NetMsg_ChangeCard';

/**
 * BattleReady_CN
 */
export class NetMsg_ChangeCard_Mod extends NetMsg_ChangeCard {

  override async Handle(req: ChangeCardRequest, client?: Client, uid?: string, token?: string, exData?: any): Promise<ChangeCardResponse> {
    Logger.LogInfo('ChangeCard_Mod.Handle', req);

    const res = await BattleServer.Instance.ChangeCard(client!, req);
    
    return res
  }
}