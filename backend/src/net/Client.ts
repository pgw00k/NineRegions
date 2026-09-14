/**
 * Client.ts — 每客户端的连接/会话状态对象（多人化骨架）。
 *
 * 由 ConnManager 统一持有，处理链路通过 `Handle(req, client)` 读写当前玩家的状态。
 * 本文件只放「连通性 + 通用属性槽」，具体业务字段由各逻辑自由 `set/get`。
 *
 * 设计要点：状态的归属者是「玩家/连接」，而非应答器实例，因此每个客户端只建一个
 * Client，共享的 MessageController 应答器通过它访问各自的游戏状态。
 *
 * ── order 记账模型（实证结论，见 logs/gw_20260911.jsonl + 客户端 JYLog）──
 *
 * 客户端 `MC.MCRoot` 维护两个互相独立的 order 空间（偏移 0x2C / 0x30）：
 *   - logicOrder  ：逻辑区间 10000..19999，由逻辑通道 `TOKEN-xxx` 上的**应答**推进；
 *   - battleOrder ：战斗区间 20000..29999，由战斗通道 `TestBattleToken-xxx` 推进。
 *
 * 客户端对每条 S2C 的校验是「order 必须严格等于所在空间当前值 + 1」，等于或跳号都会被
 * 丢弃（实证：`drop invalid package, logicorder: 2 order: 2` 与 `logicorder: 7 order: 9`
 * 同时存在）。因此服务端也必须按「客户端视角 + 分空间」记账，绝不能把战斗推送的 order
 * 算进逻辑序列 —— 那正是先前 `25015(order=8)` 之后心跳应答变成 9/10/11 被丢弃的根因。
 */
import { Buffer } from 'buffer';
import { get, encodeMessage, MESSAGE_ID, PushBattleWaiting } from 'mc-local-share';
import { DecodedC2S, S2CFrame } from '../messages/types';
import { Logger } from '../core/Logger';
import { wrapDynProtoAuto } from './FrameCodec';
import { MessageController } from './msg/MessageController';

/** 战斗区间起点：msgId >= 该值属于战斗 order 空间（battleOrder），不参与逻辑序列记账。 */
const BATTLE_SPACE_BEGIN = MESSAGE_ID.BATTLE_MESSAGE_BEGIN;

/**
 * 一条 S2C 帧的出站通道。
 *
 * 由 WsGateway 在连接建立时注入（`client.bindSender(...)`），Client 每产出一帧就立即
 * 通过它下发到 socket。之所以不依赖 `route()` 的返回值：服务端主动推送 / 延迟应答发生在
 * 一个完全无关的调用栈（定时器、另一个玩家的请求）里，此时 `route()` 的返回值无人接收，
 * 帧会滞留在队列中直到下一条 C2S 被顺带带出 —— 既造成延迟，也让心跳应答被“跳过”。
 */
export type S2CSender = (frame: S2CFrame) => void;

export class Client {
  readonly connId: string;
  /** 日志器（可选：用于记录客户端侧处理告警）。 */
  private readonly logger?: Logger;
  /** 出站通道：绑定后 `pushFrame` 产出的帧会立即下发（见 S2CSender 说明）。 */
  private sender?: S2CSender;
  /** 绑定的用户 ID（由「连接后首条消息」注入，见 MessageRouter 中 bind 标记）。 */
  private uid$ = '';
  /** 通用业务属性槽（背包、卡组、会话、位置等）。 */
  private readonly props = new Map<string, unknown>();
  /**
   * 逻辑 order 空间的当前基准值（客户端 logicOrder）。
   *
   * 客户端对每条逻辑区间（10000..19999）的 S2C 校验是「order 必须严格等于 logicOrder + 1」：
   * 相等（`logicorder: 2 order: 2`）或跳号（`logicorder: 7 order: 9`）一律丢弃该帧。
   * 因此服务端必须以「客户端视角」逐格推进，且只统计逻辑区间的帧 —— 战斗/推送区间
   * （msgId >= BATTLE_MESSAGE_BEGIN，走 battleOrder）绝不能算进这条序列。
   */
  protected order = 0;
  /**
   * 战斗 order 空间的当前基准值（客户端 battleOrder）。
   *
   * 客户端战斗通道（`TestBattleToken-xxx`）虽然单列一个 battleOrder 计数，但实证表明它
   * 会「顺接」逻辑序继续往下走，并非从 0 独立起算：gw_20260911.jsonl 第 882/886/887 行
   * `S2C 10016 order=8` → `S2C 25015 order=9` → `C2S 25001 order=9`，客户端接受并回显了 9。
   * 因此这里不能固定从 0 开始，否则服务端会发出 `25015 order=1`，把「心跳被丢」变成
   * 「战斗帧被丢」。播种只在首次发战斗帧时进行一次（见 pushFrame 战斗分支）。
   */
  protected battleOrder = -1;
  /** 战斗通道是否已播种（首次发战斗帧时以 order 为基准对齐，见 pushFrame 战斗分支）。 */
  private battleSeeded = false;
  /** 本连接待下发的 S2C 帧队列（一个 C2S 可产出多条；由调用方处理完请求后取走）。 */
  private readonly pending: S2CFrame[] = [];

  constructor(connId: string, logger?: Logger) {
    this.connId = connId;
    this.logger = logger;
  }

  get uid(): string {
    return this.uid$;
  }

  setUid(uid: string): void {
    this.uid$ = uid;
  }

  /** 注入出站通道（WsGateway 在连接建立时调用）。 */
  bindSender(sender: S2CSender): void {
    this.sender = sender;
  }

  /**
   * 收到一条逻辑区间 C2S 时同步 order 基准。
   *
   * 客户端发出 order = n 的逻辑消息后，其本地 logicOrder 随之推进到 n，因此它下一条期待
   * 收到的逻辑 S2C 必然是 n + 1。服务端以此对齐基准，保证后续应答落在客户端可接受的窗口内。
   *
   * 取 max 是为了容忍乱序：客户端 order 单调递增，后到的旧包不应把基准拉回去。
   * 注意：战斗区间（msgId >= BATTLE_MESSAGE_BEGIN）的 order 属于 battleOrder 通道，
   * 调用方（MessageRouter）不应把它的 order 传进来，以免污染逻辑基准。
   */
  syncOrder(reqOrder: number): void {
    if (reqOrder > this.order) this.order = reqOrder;
  }

  /**
   * 入队一条 S2C，并按「客户端视角」分配 order。
   *
   * 逻辑区间（msgId < BATTLE_MESSAGE_BEGIN）：order = 当前基准 + 1（严格 +1，不跳号），
   * 无论这条帧来自 C2S 应答、服务端主动推送还是心跳应答，都在同一根单调序列上顺延，
   * 客户端每收一条就把 logicOrder 推进一格，始终同步。
   *
   * 战斗区间（msgId >= BATTLE_MESSAGE_BEGIN，如 PUSH_BATTLEWAITING=25015）：客户端战斗
   * 通道有自己的 battleOrder，但实证表明它「顺接」逻辑序 —— 因此战斗帧以当前 `order`
   * 为起点播种，之后在战斗序列上继续 +1，逻辑帧则在 `order` 上 +1，两条序列共享同一
   * 基准、各自推进（见 pushFrame 战斗分支）。
   *
   * 帧的流转分两种模式：
   *  - 已绑定出站通道：立即下发，`pending` 只做「已发」流水（返回值为空）；
   *  - 未绑定（单测 / 离线装配）：留在 `pending`，由 drainPending 取走。
   *
   * @param body 已 wrap 好 dynproto 头的业务体。
   * @returns 本次为这条帧分配的 order。
   */
  pushFrame(msgId: number, body: Buffer, order?: number): number {
    let newOrder: number;
    if (msgId >= BATTLE_SPACE_BEGIN) {
      // 战斗空间：仅在首次发战斗帧时以逻辑序当前值为起点播种（方案B），此后战斗序列独立
      // 递增。这里必须「只播种一次」：若每次都取 max(order, battleOrder) 再 +1，那么逻辑序
      // 一旦因任何原因推进（例如同一 C2S 又回了一条 10004），战斗序就会被反复抬到逻辑序之上，
      // 出现 10016(order=7) → 25015(order=9) 这种跳号，客户端的 battleOrder 期望 8，收到 9
      // 直接丢弃，表现为「进不去战斗」（实证 gw_20260911.jsonl 第 665 行）。
      if (!this.battleSeeded) {
        this.battleOrder = this.order;
        this.battleSeeded = true;
      }
      this.battleOrder += 1;
      newOrder = this.battleOrder;
    } else {
      // 逻辑空间：order 基准只在「协议上仍可推进」时对齐。
      //
      // 客户端对逻辑 S2C 的校验是 order === logicOrder + 1。若服务端基准被顶高（重复应答、
      // 战斗帧抢占同一格），此后所有逻辑帧都会跳号被丢，客户端停在原地反复重发心跳 ——
      // 已观测到 `10003 order=7` → `10004 order=9`（跳过 8，丢弃）→ 客户端再发 `10003 order=7`。
      // 既有的 `order > this.order` 只能挡住「平格」，挡不住「基准已被顶高」的情况，
      // 因此这里加 `this.order <= reqOrder`：基准一旦领先于请求 order（说明该请求期待的格子
      // 已经发过），就拒绝回退，避免同一格被两条帧各占一次。
      if (order !== undefined && order >= this.order) {
        this.order = order;
      }
      this.order += 1;
      newOrder = this.order;
    }
    const frame: S2CFrame = { msgId, order: newOrder, body };
    if (this.sender) {
      this.sender(frame);
    } else {
      this.pending.push(frame);
    }
    return newOrder;
  }

  /** 以显式 order 入队（特殊帧，如心跳 PINGPONG 沿用约定 order，不走 +1）。 */
  enqueue(msgId: number, order: number, body: Buffer): void {
    const frame: S2CFrame = { msgId, order, body };
    if (this.sender) {
      this.sender(frame);
    } else {
      this.pending.push(frame);
    }
  }

  /**
   * 回显一条「原样帧」：msgId / order / body 均按协议约定直接下发，不做 +1 记账。
   *
   * 用于网络层内部消息（msgId < ACCOUNT_MESSAGE_BEGIN，如 PINGPONG=7）：这类消息不进入
   * 业务应答器，客户端只要求「收到同号回包即视为心跳存活」，其 order 与 body 都沿用
   * C2S 原值（实证见 logs/develop.jsonl：C2S msg=7 order=0 → S2C msg=7 order=0 空体）。
   * 因此这里既不能走 pushFrame 的 +1，也不能忽略不回 —— 否则客户端心跳计数停在原地。
   */
  echoFrame(msgId: number, order: number, body: Buffer): void {
    const frame: S2CFrame = { msgId, order, body };
    if (this.sender) {
      this.sender(frame);
    } else {
      this.pending.push(frame);
    }
  }

  /**
   * 取走并清空待下发帧（由 WsGateway 下发到 socket）。空队列返回空数组。
   * 已绑定出站通道时帧已在 pushFrame 内即时下发，此处恒为空 —— 保留是为了兼容
   * `route()` 的返回值消费路径与离线装配/单测场景。
   */
  drainPending(): S2CFrame[] {
    if (this.pending.length === 0) return [];
    const frames = this.pending.slice();
    this.pending.length = 0;
    return frames;
  }

  set<T>(key: string, value: T): void {
    this.props.set(key, value);
  }

  get<T>(key: string): T | undefined {
    return this.props.get(key) as T | undefined;
  }

  has(key: string): boolean {
    return this.props.has(key);
  }

  /**
   * 处理一条已解码的请求，完成「应答器判断 → Handle → 编码 → order 记账 → 帧排队」。
   *
   * 该方法是请求-应答闭环里落在本客户端上的那一层：dispatch 决策在这里进行。
   * 共享的 MessageController 以参数注入（单例），本对象不持有它，从而不引入连接态。
   * 帧入队后立即 drain 返回，由调用方（事件驱动，无定时器）取走发送。
   *
   * @param req        已解码的请求体。
   * @param msgId      请求消息号（reqId）。
   * @param order      C2S 的 order；首条应答 order = 请求 order + 1。
   * @param controller 共享应答器表。
   * @returns 本次处理产出的待下发帧（0 或多条）。
   */
  async process(
    req: Record<string, unknown>,
    order: number,
    msgId: number,
    uid?: string,
    token?: string,
    controller?: MessageController,
  ): Promise<S2CFrame[]> {
    if (!controller) {
      this.logger?.error('client', `[${this.connId}] 处理 req#${msgId} 异常: 未注入 MessageController`);
      return [];
    }
    // 应答器判断：未注册该消息号 → 不应答
    const responder = controller.AutoResponser[msgId as MESSAGE_ID] as any | undefined;
    if (!responder) {
      this.logger?.warn('client', `[${this.connId}] 处理 req#${msgId} 异常: 未注册应答器`);
      return [];
    };

    // ① Handle：取得返回对象（可能 async 查询数据库，统一 await 以支持 DB 填充）
    let rep: Record<string, unknown>;
    try {
      rep = await responder.Handle(req, this, uid, token);
    } catch (e) {
      this.logger?.warn('client', `[${this.connId}] 处理 req#${msgId} 异常: ${(e as Error).message}`);
      return [];
    }

    // 不做保底，无效信息不发送，保证队列逻辑order和客户端能够对应
    if (!rep) {
      return [];
    };

    try {
      this.PushMessage(responder.recId, rep, order);
      return this.drainPending();
    } catch (e) {
      this.logger?.warn('client', `[${this.connId}] 编码 rec#${responder.recId} 失败: ${(e as Error).message}`);
      return [];
    }
  }

  /** 
   * 推送一个消息到队列中 
   * 
   * @param msgid 消息号
   * @param data 消息体
   * @param order 消息 order，不带消息Order的话会自动使用处记录的Order
   * */
  public PushMessage(msgid: MESSAGE_ID, data: any, order?: number): void {
    // this.logger?.info( `client [${this.connId}] 推送 msg#${msgid}`,data);
    let repSchema = get(msgid);
    if (!repSchema) {
      this.logger?.warn('client', `[${this.connId}] 编码 msg#${msgid} 失败: 未注册编码器`);
      return;
    }

    try {
      let raw = encodeMessage(repSchema, data as any)
      this.pushFrame(msgid, wrapDynProtoAuto(raw), order);
    }
    catch (e) {
      this.logger?.warn('client', `[${this.connId}] 编码 msg#${msgid} 失败: ${(e as Error).message}`);
    }

  }
}