import { Logger } from '../../core/Logger';
import { Client } from '../Client';
import { ErrorCode, BattleReconnectionRequest, BattleReconnectionResponse } from 'mc-local-share';
import { NetMsg_BattleReconnection } from '../msg/NetMsg_BattleReconnection';
import { BattleServer } from '../../Battle/BattleServer';

/**
 * BattleReconnection（C2S 20001 → S2C 20002）战斗弱重连。
 *
 * 客户端在等待战斗消息超时（`Recon_WaitDealMsg` / `Recon_WaitActingMsg` / `Recon_WaitBattleResult`）
 * 时会 `ResetBattle()` 并**另建一条 WebSocket**，在新连接上发 20001。
 * 因此处理这条消息的 Client 与战斗原来所用的 Client 不是同一个对象，
 * 必须让房间把出站通道换绑到新连接（见 BattleRoom.Reconnect）。
 *
 * 注意：20001 走战斗 order 空间（msgId ≥ BATTLE_MESSAGE_BEGIN），MessageRouter 不会把它的
 * order 同步进逻辑基准；新连接的 battleOrder 由 router 按请求 order 播种（见 Client.syncBattleOrder）。
 */
export class NetMsg_BattleReconnection_Mod extends NetMsg_BattleReconnection {

  override async Handle(req: BattleReconnectionRequest, client?: Client, uid?: string, token?: string, exData?: any): Promise<BattleReconnectionResponse> {
    Logger.LogInfo(`BattleReconnection_Mod.Handle uid=${uid} token=${token} version=${req.version} accountToken=${req.accountToken}`);

    if (!client || !client.uid) {
      return { error: ErrorCode.SESSION_NOT_FIND } as BattleReconnectionResponse;
    }

    return BattleServer.Instance.Reconnect(client);
  }
}
