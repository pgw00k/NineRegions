/**
 * MessageRouter.ts — 消息路由编排。
 *
 * 收到一条 C2S（msgId/order/body）后：计算应答消息号 repMsgId，构造 HandlerContext，
 * 依次尝试各处理器（内部 → mock → 兜底 echo），首个 match 的处理器负责产出 S2C 帧。
 *
 * 应答号规则（实证：本游戏所有 REQ/REP 配对均为 REP = REQ + 1）：
 *  - 内部消息：repMsgId = 自身（回显）；
 *  - 其余：优先用注册表 responseId，缺失时回退 msgId + 1。
 */
import { Buffer } from 'buffer';
import { HandlerServices, HandlerContext, MessageHandler, S2CFrame, INTERNAL_MSG_IDS } from './types';
import { MessageRegistry } from './MessageRegistry';
import { MockLoader } from './MockLoader';
import { InternalHandler } from './handlers/InternalHandler';
import { MockHandler } from './handlers/MockHandler';
import { EchoHandler } from './handlers/EchoHandler';
import { BattleHandler } from './handlers/BattleHandler';
import { ReconnectHandler } from './handlers/ReconnectHandler';
import { NameHandler } from './handlers/NameHandler';
import { UserStateStore } from '../state/UserState';
import { MOCKS_DIR_ABS } from '../config/env';
import { LOGIC_RECONNECTION_REQ, BATTLE_RECONNECTION_REQ } from '../net/OrderTracker';

/** 空闲心跳消息号（PINGPONG）。 */
const PINGPONG_MSGID = 7;
/** CREATE_PVEROOM_REQ：lua 实证成功时服务端不应答（仅出错才回 10010）。 */
const CREATE_PVEROOM_REQ = 10009;

export class MessageRouter {
  private readonly handlers: MessageHandler[];
  private readonly registry: MessageRegistry;
  private readonly services: HandlerServices;

  constructor(services: HandlerServices) {
    this.services = services;
    this.registry = services.registry;
    const loader = new MockLoader(MOCKS_DIR_ABS, services.schema, services.encoder, services.logger);
    this.handlers = [
      new InternalHandler(),
      new ReconnectHandler(loader, services.users),
      new BattleHandler(),
      new NameHandler(),
      new MockHandler(loader),
      new EchoHandler(),
    ];
  }

  /** 路由一条 C2S，返回要下发的 S2C 帧列表（通常 1 条）。 */
  route(connId: string, msgId: number, order: number, body: Buffer): S2CFrame[] {
    // 记录最近 req order（服务端主动推送的 order 基准）
    this.services.orders.noteReq(connId, order);
    // PVE 结算状态机：会话时间 / 战斗进出状态
    this.services.pve.noteSession(connId);
    this.services.pve.noteBattleMsg(connId, msgId);

    // 用户状态绑定：从 C2S body 提取 playerID，建立 connId→userId 映射（重连恢复用）
    const uid = UserStateStore.extractUserId(body);
    if (uid) this.services.users.bind(connId, uid);

    // 用户状态迁移（重连/登录时据此返回 battleRoomType）
    if (msgId === 10019) this.services.users.markTutorialDone(connId); // PVE_SKIP → 教程完成
    if (msgId === 25012 || msgId === 25014) this.services.users.markBattleEnded(connId); // 战斗结束

    // ★重连识别：客户端重连 / 战斗重连请求走明文侧信道到达，收到即标记本连接为重连会话，
    // 使得后续 BattleStartResponse(15018) 后能同步重置 order 计数器（对齐客户端 logicOrder 重置）。
    if (msgId === LOGIC_RECONNECTION_REQ || msgId === BATTLE_RECONNECTION_REQ) {
      this.services.orders.markReconnect(connId);
      this.services.logger.info('router', `[${connId}] 检测到重连请求 msgId=${msgId} → 标记为重连会话${uid ? `，user=${uid}` : ''}`);
    }

    // CREATE_PVEROOM_REQ：成功不应答（lua 实证），避免 EchoHandler 回显垃圾
    if (msgId === CREATE_PVEROOM_REQ) {
      this.services.logger.info('router', `[${connId}] CreatePVERoom 成功 → 按协议不应答`);
      return [];
    }

    const repMsgId = INTERNAL_MSG_IDS.has(msgId)
      ? msgId
      : this.registry.responseId(msgId) ?? msgId + 1;

    const ctx: HandlerContext = {
      connId,
      msgId,
      order,
      body,
      repMsgId,
      services: this.services,
    };

    const frames: S2CFrame[] = [];
    for (const h of this.handlers) {
      if (h.match(ctx)) {
        frames.push(...h.handle(ctx));
        break;
      }
    }

    // 空闲心跳兜底：重连会话上「未进战斗 / 战斗进入超时」→ 自动补推 PUSH_PVECOMPLETE(15003)，
    // 修复客户端打完引导战斗后只发心跳、等待结算被卡死的问题（15003 → Guide_PVEComplete）。
    // ★门控：仅「引导未完成」的用户需要 15003 兜底；已跳过引导（有名字/引导全通）的
    // 主界面用户绝不推（否则会把 PVE 进度又标回 10001，干扰主界面初始化）。
    const ust = this.services.users.state(connId);
    const needsTutorial = !ust || !ust.tutorialDone;
    if (msgId === PINGPONG_MSGID && needsTutorial && this.services.pve.shouldAutoPush(connId, this.services.orders.isReconnect(connId))) {
      this.services.pve.pushComplete(connId);
      this.services.users.markTutorialDone(connId);
      this.services.users.markBattleEnded(connId);
    }

    return frames;
  }
}
