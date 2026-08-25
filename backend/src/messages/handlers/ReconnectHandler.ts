/**
 * ReconnectHandler.ts — 重连响应（10011 → 10012）动态化。
 *
 * lua 实证（NetMsg_MainTownReconnect）：LogicReconnectionResponse 的
 *   #12 battleRoomType / #13 battleAccountToken / #14 battleRoomToken / #15 battleResult
 * 非空 → 客户端 ReLoginBattleProcedure 重进战斗；roomType=0 则跳过（实测客户端日志
 * "Reconnect Enter battle : false roomType: 0"）。RoomType 枚举：NULL=0, PVE_ROOM=1。
 *
 * 本处理器：在 mocks/10012.json 基础上，若用户状态 inBattle（教程战斗未完成）则
 * 追加 battleRoomType=1(PVE_ROOM)+token+roomToken，使客户端重连后重进教程战斗，
 * 从而走完战斗→结算（PUSH_PVECOMPLETE 15003）流程。
 */
import { Buffer } from 'buffer';
import { MessageHandler, HandlerContext, S2CFrame, buildResponseFrame } from '../types';
import { MockLoader } from '../MockLoader';
import { UserStateStore } from '../../state/UserState';

/** 重连请求消息号。 */
export const LOGIC_RECONNECTION_REQ = 10011;
/** 战斗级重连请求（客户端处于战斗中时发出，期望 20002 BattleReconnectionResponse）。 */
export const BATTLE_RECONNECTION_REQ = 20001;

export class ReconnectHandler extends MessageHandler {
  constructor(
    private readonly loader: MockLoader,
    private readonly users: UserStateStore,
  ) {
    super();
  }

  match(ctx: HandlerContext): boolean {
    return ctx.msgId === LOGIC_RECONNECTION_REQ || ctx.msgId === BATTLE_RECONNECTION_REQ;
  }

  handle(ctx: HandlerContext): S2CFrame[] {
    try {
      if (ctx.msgId === BATTLE_RECONNECTION_REQ) return this.battleReconnect(ctx);
      const base = this.loader.load(10012); // mocks/10012.json 基础应答
      const st = this.users.state(ctx.connId);
      let inner = base;
      if (st && st.inBattle) {
        const s = ctx.services.schema.getByShortName('LogicReconnectionResponse');
        if (s) {
          // PVE_ROOM=1 + 会话 token（与 25002 BattleStartResponse 同源，客户端 resume 用）
          const extra = ctx.services.encoder.encode(s, {
            12: 1, // battleRoomType = PVE_ROOM
            13: 'localtoken123', // battleAccountToken
            14: '1', // battleRoomToken
            15: 0, // battleResult
          });
          inner = Buffer.concat([base, extra]);
          // 客户端将 ReLoginBattleProcedure 重进战斗 → 标记「战斗激活」：
          // 1) 抑制过早的 15003 自动补推（战斗恢复中先让战斗续起来）；
          // 2) 心跳兜底（战斗进入超时 60s 无结束）仍会补推 15003，防止再次卡死。
          this.markBattleActive(ctx);
          ctx.services.logger.info(
            'reconnect',
            `[${ctx.connId}] 用户 ${st.userId} inBattle → 10012 追加 battleRoomType=PVE_ROOM(1) resume 教程战斗（战斗激活，抑制过早补推）`,
          );
        }
      }
      return [buildResponseFrame(ctx, inner)];
    } catch (e) {
      ctx.services.logger.error('reconnect', `10012 构造失败: ${(e as Error).message}`);
      return [];
    }
  }

  /** 20001 战斗级重连 → 20002 BattleReconnectionResponse（客户端处于战斗中时）。 */
  private battleReconnect(ctx: HandlerContext): S2CFrame[] {
    const s = ctx.services.schema.getByShortName('BattleReconnectionResponse');
    if (!s) return [];
    const st = this.users.state(ctx.connId);
    const inner = ctx.services.encoder.encode(s, {
      1: 0, // error=SUCCESS
      2: 'localtoken123', // token
      3: '1', // roomToken
      4: 1, // roomType = PVE_ROOM
      6: 1, // roundNum
      7: 0, // step = NOT_CHANGE
      9: 0, // side
    });
    this.markBattleActive(ctx);
    ctx.services.logger.info(
      'reconnect',
      `[${ctx.connId}] 战斗级重连 20001 → 20002 error=0 roomType=PVE_ROOM(1) step=NOT_CHANGE（战斗激活，抑制过早补推${st ? `，user=${st.userId}` : ''}）`,
    );
    return [buildResponseFrame(ctx, inner)];
  }

  /** 标记战斗激活：抑制过早 15003 自动补推；60s 战斗超时后心跳兜底仍会补推。 */
  private markBattleActive(ctx: HandlerContext): void {
    ctx.services.pve.noteBattleMsg(ctx.connId, 25001);
    ctx.services.users.markInBattle(ctx.connId);
  }
}
