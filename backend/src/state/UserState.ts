/**
 * UserState.ts — 按「模拟用户 ID」记录会话状态（断线重连恢复依据）。
 *
 * 背景（lua 实证）：NetMsg_MainTownReconnect(10012) 依据 LogicReconnectionResponse 的
 * battleRoomType/battleAccountToken/battleRoomToken 决定是否 ReLoginBattleProcedure
 * 重进战斗；EnterGameResponse(10002) 同款字段（#15-18）。客户端无名字时
 * NewbieLogic 自动 CreatePVERoom(1,0,10001) 进教程战斗。
 *
 * 本模块：C2S body（NetBitStream 前缀）中提取 playerID（最长数字串），
 * 建立 connId→userId、userId→状态 的映射，供重连响应动态携带 battleRoomType。
 */
import { Buffer } from 'buffer';

export interface UserState {
  /** 模拟用户 ID（如 7561198124119613）。 */
  userId: string;
  /** 是否已设置名字（CheckHasName）。 */
  hasName: boolean;
  /** 教程关卡（10001）。 */
  tutorialStage: number;
  /** 教程战斗是否已完成（跳过或结算推送后置真）。 */
  tutorialDone: boolean;
  /** 是否有未完成的战斗（重连时应 resume）。 */
  inBattle: boolean;
}

export class UserStateStore {
  private byConn = new Map<string, string>();
  private byUser = new Map<string, UserState>();

  /** 把连接绑定到用户（首次出现则初始化状态：模拟「新手引导已完成」模式）。 */
  bind(connId: string, userId: string): void {
    this.byConn.set(connId, userId);
    if (!this.byUser.has(userId)) {
      this.byUser.set(userId, {
        userId,
        hasName: true, // mock playerInfo 已带名字 → 跳过新手引导
        tutorialStage: 10001,
        tutorialDone: true, // 引导关卡已完成（跳过模式）
        inBattle: false, // 默认无战斗可恢复；进入战斗(25001)时置真
      });
    }
  }

  userId(connId: string): string | undefined {
    return this.byConn.get(connId);
  }

  state(connId: string): UserState | undefined {
    const u = this.byConn.get(connId);
    return u ? this.byUser.get(u) : undefined;
  }

  /** 连接断开：解除绑定（保留用户级状态，供下次重连）。 */
  unbind(connId: string): void {
    this.byConn.delete(connId);
  }

  /** 记录教程战斗完成（跳过/结算推送）；inBattle 保持 true —— 无名字时客户端始终回教程。 */
  markTutorialDone(connId: string): void {
    const s = this.state(connId);
    if (s) s.tutorialDone = true;
  }

  markInBattle(connId: string): void {
    const s = this.state(connId);
    if (s) s.inBattle = true;
  }

  /** 战斗结束（25012/25014）：仅记录，inBattle 保持 true 直至起名成功（恢复战斗重播）。 */
  markBattleEnded(connId: string): void {
    const s = this.state(connId);
    if (s) s.tutorialDone = true;
  }

  /** 起名成功：hasName=true 且 inBattle=false（教程真正完成，后续重连不再恢复战斗）。 */
  setHasName(connId: string): void {
    const s = this.state(connId);
    if (s) {
      s.hasName = true;
      s.inBattle = false;
    }
  }

  /**
   * 从 C2S body（NetBitStream 前缀 + 内嵌 protobuf）提取 playerID：
   * 取最长数字串（≥12 位）。10011/10019 实测携带 7561198124119613。
   */
  static extractUserId(body: Buffer): string | null {
    let best = '';
    let cur = '';
    for (const b of body) {
      const c = String.fromCharCode(b);
      if (c >= '0' && c <= '9') {
        cur += c;
      } else {
        if (cur.length > best.length) best = cur;
        cur = '';
      }
    }
    if (cur.length > best.length) best = cur;
    return best.length >= 12 ? best : null;
  }
}
