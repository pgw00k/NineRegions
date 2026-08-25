/**
 * PveSettlement.ts — PVE 结算推送状态机（修复「引导战斗结束、等待结算」卡死）。
 *
 * 驱动链（lua 实证）：
 *   服务端主动推送 PUSH_PVECOMPLETE(15003) → NetMsg_PVECompletePush.OnReceive
 *   → PVEDataMgr.ParserPVEComplete(chapter, stage, isWin)
 *   → Eventer.Fire("Guide_PVEComplete", stage)
 *   → 引导流程（PVEMap0_1）推进，客户端离开「等待结算」。
 *
 * 客户端空闲时只发 PINGPONG(7) 心跳（msgId=7 是心跳，非 bug），等待服务端推送。
 * 本组件负责「何时推送 15003」：
 *  - 收到战斗结束类 C2S（SHOW_END_REQ=25012 / SUMMARY_DONE=25014）→ 由 BattleHandler 随应答帧推送；
 *  - 重连会话上仅剩心跳（未进战斗 / 战斗进入超时无结束）→ 心跳到达时自动补推（兜底，防再次卡死）。
 * 首连会话不自动补推，避免打断登录/引导时序（首连走 BattleHandler 的正常战斗结束路径）。
 */
import { Buffer } from 'buffer';
import { Logger } from '../core/Logger';

/** 会话建立后、允许自动补推前的宽限时间（让战斗入场消息先到达）。 */
const SESSION_GRACE_MS = 5000;
/** 战斗进入超过该时长仍无结束消息 → 视为卡死，心跳兜底补推。 */
const BATTLE_STALE_MS = 60000;

/** 战斗入场消息（进入战斗）。 */
const BATTLE_ENTER_MSGID = 25001;
/** 战斗结束类消息（离开战斗）。 */
const BATTLE_END_MSGIDS = new Set<number>([25009, 25012, 25014]);

export class PveSettlementService {
  private sessionStart = new Map<string, number>();
  private battleEnteredAt = new Map<string, number>();
  private pushed = new Set<string>();
  private readonly buildBodyFn: () => Buffer;

  constructor(
    /** 立即下发 15003 推送（order 已由调用方 / 内部按最近 req order 计算）。 */
    private readonly sendPush: (connId: string, innerPbuf: Buffer) => void,
    /** 构建 PushPVEComplete 内体字节（chapter/stage/isWin）。 */
    buildBody: () => Buffer,
    private readonly logger: Logger,
  ) {
    this.buildBodyFn = buildBody;
  }

  /** 记录会话首次 C2S 时间（自动补推的宽限期基准）。 */
  noteSession(connId: string): void {
    if (!this.sessionStart.has(connId)) this.sessionStart.set(connId, Date.now());
  }

  /** 按收到的一条 C2S 更新战斗状态（进入/结束）。 */
  noteBattleMsg(connId: string, msgId: number): void {
    if (msgId === BATTLE_ENTER_MSGID) {
      this.battleEnteredAt.set(connId, Date.now());
    } else if (BATTLE_END_MSGIDS.has(msgId)) {
      this.battleEnteredAt.delete(connId);
    }
  }

  /** 心跳(7)到达时判断是否应自动补推 15003。仅重连会话、且未进战斗或战斗进入超时。 */
  shouldAutoPush(connId: string, isReconnect: boolean, now = Date.now()): boolean {
    if (!isReconnect) return false; // 首连走正常战斗结束路径，不自动补推
    if (this.pushed.has(connId)) return false;
    const sessionStart = this.sessionStart.get(connId);
    if (sessionStart === undefined || now - sessionStart < SESSION_GRACE_MS) return false;
    const bEntered = this.battleEnteredAt.get(connId);
    if (bEntered === undefined) return true; // 本会话从未进战斗 → 已过战斗阶段，直接补推
    return now - bEntered >= BATTLE_STALE_MS; // 战斗进入超时无结束 → 视为卡死
  }

  /** 立即补推 15003（心跳兜底路径；已推过则忽略）。 */
  pushComplete(connId: string): void {
    if (this.pushed.has(connId)) return;
    this.doPush(connId);
  }

  /** 标记已推送（供 BattleHandler 在随应答帧推送时调用，避免自动补推重复）。 */
  markPushed(connId: string): void {
    this.pushed.add(connId);
  }

  /** 构建 PushPVEComplete 内体字节（供 BattleHandler 直接组装 S2C 帧）。失败抛错由调用方处理。 */
  buildBody(): Buffer {
    return this.buildBodyFn();
  }

  /** 连接断开清理。 */
  reset(connId: string): void {
    this.sessionStart.delete(connId);
    this.battleEnteredAt.delete(connId);
    this.pushed.delete(connId);
  }

  private doPush(connId: string): void {
    let inner: Buffer;
    try {
      inner = this.buildBodyFn();
    } catch (e) {
      this.logger.error('pve', `构建 PushPVEComplete 失败: ${(e as Error).message}`);
      return;
    }
    this.pushed.add(connId);
    this.sendPush(connId, inner);
    this.logger.info('pve', `[${connId}] 推送 PUSH_PVECOMPLETE(15003) chapter=1 stage=10001 isWin=1`);
  }
}
