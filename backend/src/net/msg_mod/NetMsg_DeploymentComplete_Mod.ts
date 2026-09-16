import {
  DeploymentCompleteRequest,
} from 'mc-local-share';
import { Logger } from '../../core/Logger';
import { Client } from '../Client';
import { BattleServer } from '../../Battle/BattleServer';
import { NetMsg_DeploymentComplete } from '../msg/NetMsg_DeploymentComplete';

/**
 * DeploymentComplete（C2S 25006）
 *
 * 玩家提交布阵动作。该消息没有对应的应答（recId=0），因此 Handle 返回 undefined，
 * Client.process 检测到空返回即不下发任何帧。真正的后续推送（25007 + 25011）
 * 由 BattleRoom 在双方都提交后主动广播。
 */
export class NetMsg_DeploymentComplete_Mod extends NetMsg_DeploymentComplete {

  override async Handle(req: DeploymentCompleteRequest, client?: Client, uid?: string, token?: string, exData?: any): Promise<any> {
    Logger.LogInfo('DeploymentComplete_Mod.Handle', req);

    await BattleServer.Instance.DeploymentComplete(client!, req);

    return undefined
  }
}
