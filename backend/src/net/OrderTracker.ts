/**
 * OrderTracker.ts — S2C 序号（order）逐连接追踪。
 *
 * 关键事实（MCNetManager.OnSetOrder @ 0x146C840 反汇编实证 + 真实服务端抓包复核）：
 *   客户端 logicOrder 校验 accept 条件 = order - logicOrder == 1（严格递增 1），
 *   回显相同 order 会被判定 drop invalid package。
 *   - 内部消息（1/2/3/4/7）不走该校验，回显 reqOrder 即可。
 *   - 逻辑消息（>=10000）首条从 reqOrder+1 起，之后逐条 +1。
 *   - ★重连对齐（2026-08-23 修正）：真实客户端在 WS 断线（1006）后走「重连/resume」
 *     状态机（MC.Framework.NetManager:ResetBattle() / MC.MCNetManager:StartReconnect），
 *     重连后会重新进战斗并收 BattleStartResponse(15018)，此时客户端把 logicOrder 重置为 1。
 *     故服务端必须在「重连会话」上、发出 15018 之后把本连接计数器重置为 1，否则战后首条
 *     逻辑消息（心跳 / PVE_SKIP 的 10020 等）order 错位被整体丢弃。
 *   - 首连（非重连）会话的 15018 是剧情跳过（STORY_SKIP），客户端不重置，故不可无差别重置。
 *   本客户端实测为「每条 WS 连接 logicOrder 从 0 起步」（per-connection），故按连接独立计数。
 */
const INTERNAL_ORDER_IDS = new Set<number>([1, 2, 3, 4, 7]);

/** 重连会话上：发出 BattleStartResponse(15018) 后客户端把 logicOrder 重置为 1，服务端需同步。 */
const BATTLE_START_RESET_MSGID = 15018;
const BATTLE_START_RESET_VALUE = 1;

/** 客户端重连/战斗重连请求（明文侧信道可达）：收到即标记本连接为「重连会话」。 */
export const LOGIC_RECONNECTION_REQ = 10011;
export const BATTLE_RECONNECTION_REQ = 20001;

export class OrderTracker {
  private orders = new Map<string, number>();
  /** 标记为重连会话的连接集合（决定是否在 15018 后同步重置）。 */
  private reconnect = new Set<string>();
  /** 每连接最近收到的 C2S order（供服务端主动推送计算 order 基准）。 */
  private lastReq = new Map<string, number>();

  /**
   * 计算下一条 S2C 帧的 order。
   * @param connId   连接标识
   * @param msgId   当前消息号（用于判断是否内部消息）
   * @param reqOrder 收到的 C2S order
   *
   * ★序号对齐（2026-08-24 实证修正）：客户端 logicOrder 是**跨重连持久**的（实测 297），
   * 服务端重启后若从 0 开始会全部对不上 → 客户端 drop invalid package。
   * 故 base = max(本连接已用序号, 客户端请求序号)，应答 = base + 1：
   * 客户端序号领先（服务端重启）时采纳客户端序号，正常时行为不变。
   */
  next(connId: string, msgId: number, reqOrder: number): number {
    if (INTERNAL_ORDER_IDS.has(msgId)) {
      return reqOrder & 0xffffffff; // 内部消息回显
    }
    const cur = this.orders.get(connId);
    const base = cur === undefined ? reqOrder : Math.max(cur, reqOrder);
    const nxt = base + 1;
    this.orders.set(connId, nxt);
    return nxt & 0xffffffff;
  }

  /**
   * 显式设置某连接的计数器（用于重连会话战斗开始后的 logicOrder 同步重置）。
   * 调用时机：15018 的 order 已用 next() 计算并下发之后，把计数器置为
   * BATTLE_START_RESET_VALUE，使下一条逻辑消息 order = 重置值 + 1。
   */
  resetTo(connId: string, value: number): void {
    this.orders.set(connId, value & 0xffffffff);
  }

  /** 标记某连接为「重连会话」（WS 重连 或 收到 LOGIC_RECONNECTION_REQ / BATTLE_RECONNECTION_REQ）。 */
  markReconnect(connId: string): void {
    this.reconnect.add(connId);
  }

  /** 该连接是否为重连会话（决定是否在 15018 后同步重置）。 */
  isReconnect(connId: string): boolean {
    return this.reconnect.has(connId);
  }

  /** 是否某消息是 BattleStartResponse（发出后、且为重连会话时需重置计数器）。 */
  static isBattleStartRep(repMsgId: number): boolean {
    return repMsgId === BATTLE_START_RESET_MSGID;
  }

  /** 战斗开始重置目标值。 */
  static get battleStartResetValue(): number {
    return BATTLE_START_RESET_VALUE;
  }

  /** 连接断开时清理状态。 */
  reset(connId: string): void {
    this.orders.delete(connId);
    this.reconnect.delete(connId);
    this.lastReq.delete(connId);
  }

  /** 记录本连接最近收到的 C2S order（服务端主动推送时作为 order 基准）。 */
  noteReq(connId: string, order: number): void {
    this.lastReq.set(connId, order & 0xffffffff);
  }

  /** 本连接最近收到的 C2S order；尚无则 0。 */
  lastReqOrder(connId: string): number {
    return this.lastReq.get(connId) ?? 0;
  }
}
