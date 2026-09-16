import { Logger } from '../../core/Logger';
import { Client } from '../Client';
import { BattleServer } from '../../Battle/BattleServer';
import { NetMsg_ShowEnd } from '../msg/NetMsg_ShowEnd';

/**
 * ShowEnd（C2S 25012）
 *
 * 客户端播完本轮表现后通知服务端推进。该消息没有对应的应答（recId=0），
 * Handle 返回 undefined。服务端据此进入下一轮（广播 25010 + 25005）或结束战斗（25008）。
 */
export class NetMsg_ShowEnd_Mod extends NetMsg_ShowEnd {

  override async Handle(req: {}, client?: Client, uid?: string, token?: string, exData?: any): Promise<any> {
    Logger.LogInfo('ShowEnd_Mod.Handle', req);

    await BattleServer.Instance.ShowEnd(client!);

    return undefined
  }
}
