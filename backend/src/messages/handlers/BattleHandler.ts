/**
 * BattleHandler.ts — 战斗域消息处理（25001–25017，教程/引导战斗相关）。
 *
 * 背景：战斗 REP（BATTLE_START_REP / FIGHT_START_REP / BATTLE_END_REP 等）是服务端
 * 主动下发；此前 2500x 不在 message-registry 中，相关 C2S 会落到 EchoHandler 回显垃圾
 * （25012 → 25013 BATTLE_COMMONERROR_REP 空转）。本处理器：
 *  - 25001 BATTLE_READY_REQ        → 25002 BATTLE_START_REP（空体，客户端本地驱动战斗）
 *  - 25003 CHANGE_CARD_REQ         → 25004 CHANGE_CARD_REP
 *  - 25006 DEPLOYMENT_COMPLETE_REQ → 25007 FIGHT_START_REP
 *  - 25009 QUIT_BATTLE_REQ         → 无需应答
 *  - 25012 SHOW_END_REQ            → BATTLE_END_REP(25008) + 推送 PUSH_PVECOMPLETE(15003)
 *  - 25014 SUMMARY_DONE            → 推送 PUSH_PVECOMPLETE(15003)
 *
 * 结算推送（15003）必须与应答帧同数组、按序下发：PlainChannel 依数组顺序逐条 sendS2C，
 * 保证客户端按 order 递增接受（先 25008 再 15003，避免 order 逆序被 drop）。
 */
import { Buffer } from 'buffer';
import { MessageHandler, HandlerContext, S2CFrame, buildResponseFrame } from '../types';
import { wrapDynProtoAuto } from '../../net/FrameCodec';

/** 战斗域 C2S（25001–25017 中需要拦截的）。 */
const BATTLE_REQ_IDS = new Set<number>([25001, 25003, 25006, 25009, 25012, 25014]);

/** 结算推送消息号。 */
export const PUSH_PVECOMPLETE_MSGID = 15003;

export class BattleHandler extends MessageHandler {
  match(ctx: HandlerContext): boolean {
    return BATTLE_REQ_IDS.has(ctx.msgId);
  }

  handle(ctx: HandlerContext): S2CFrame[] {
    switch (ctx.msgId) {
      case 25001: // BATTLE_READY_REQ → BATTLE_START_REP（roomType=PVE_ROOM + 会话 token）
        return this.battleStart(ctx);
      case 25003: // CHANGE_CARD_REQ → CHANGE_CARD_REP
        return [buildResponseFrame(ctx, Buffer.alloc(0))];
      case 25006: // DEPLOYMENT_COMPLETE_REQ → FIGHT_START_REP
        return [buildResponseFrame(ctx, Buffer.alloc(0))];
      case 25009: // QUIT_BATTLE_REQ：战斗退出无需应答
        return [];
      case 25012: // SHOW_END_REQ → BATTLE_END_REP + 推送结算
        return this.showEnd(ctx);
      case 25014: // SUMMARY_DONE → 推送结算
        return [this.buildPvePushFrame(ctx)];
      default:
        return [];
    }
  }

  /** BATTLE_START_REP：带 roomType=PVE_ROOM(1)、token/roomToken（与 10012 重连恢复同源）。 */
  private battleStart(ctx: HandlerContext): S2CFrame[] {
    ctx.services.users.markInBattle(ctx.connId);
    const s = ctx.services.schema.getByShortName('BattleStartResponse');
    if (s) {
      try {
        const inner = ctx.services.encoder.encode(s, {
          1: 1, // roomType = PVE_ROOM
          2: 'localtoken123', // token (battleAccountToken)
          3: '1', // roomToken
          6: 1, // roundNum
        });
        return [buildResponseFrame(ctx, inner)];
      } catch (e) {
        ctx.services.logger.error('battle', `25002 构造失败: ${(e as Error).message}`);
      }
    }
    return [buildResponseFrame(ctx, Buffer.alloc(0))];
  }

  /** SHOW_END_REQ：先回 BATTLE_END_REP(25008)，再随帧推 15003（数组顺序保证 order 递增）。 */
  private showEnd(ctx: HandlerContext): S2CFrame[] {
    const endOrder = ctx.services.orders.next(ctx.connId, 25008, ctx.order);
    const endFrame: S2CFrame = {
      msgId: 25008,
      order: endOrder,
      body: wrapDynProtoAuto(Buffer.alloc(0)),
    };
    return [endFrame, this.buildPvePushFrame(ctx)];
  }

  /** 组装 15003 推送帧（order 取下一序号，body 为 PushPVEComplete 内体 + dynproto）。 */
  private buildPvePushFrame(ctx: HandlerContext): S2CFrame {
    ctx.services.pve.markPushed(ctx.connId); // 防自动补推重复
    let inner: Buffer;
    try {
      inner = ctx.services.pve.buildBody();
    } catch (e) {
      ctx.services.logger.error('battle', `构建 PushPVEComplete 失败: ${(e as Error).message}`);
      inner = Buffer.alloc(0);
    }
    const order = ctx.services.orders.next(ctx.connId, PUSH_PVECOMPLETE_MSGID, ctx.order);
    return { msgId: PUSH_PVECOMPLETE_MSGID, order, body: wrapDynProtoAuto(inner) };
  }
}
