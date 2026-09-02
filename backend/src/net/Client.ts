/**
 * Client.ts — 每客户端的连接/会话状态对象（多人化骨架）。
 *
 * 由 ConnManager 统一持有，处理链路通过 `Handle(req, client)` 读写当前玩家的状态。
 * 本文件只放「连通性 + 通用属性槽」，具体业务字段由各逻辑自由 `set/get`。
 *
 * 设计要点：状态的归属者是「玩家/连接」，而非应答器实例，因此每个客户端只建一个
 * Client，共享的 MessageController 应答器通过它访问各自的游戏状态。
 */
import { Buffer } from 'buffer';
import { MESSAGE_ID, get, encodeMessage } from 'mc-local-share';
import { S2CFrame } from '../messages/types';
import { Logger } from '../core/Logger';
import { wrapDynProtoAuto } from './FrameCodec';
import { MessageController } from './msg/MessageController';

export const CONNECT_MESSAGE_IDS=[
  MESSAGE_ID.ENTER_GAME_REQ,
  MESSAGE_ID.LOGIC_RECONNECTION_REQ,
  MESSAGE_ID.BATTLE_RECONNECTION_REQ,
]

export class Client {
  readonly connId: string;
  /** 日志器（可选：用于记录客户端侧处理告警）。 */
  private readonly logger?: Logger;
  /** 绑定的用户 ID（由「连接后首条消息」注入，见 MessageRouter 中 bind 标记）。 */
  private uid$ = '';
  /** 通用业务属性槽（背包、卡组、会话、位置等）。 */
  private readonly props = new Map<string, unknown>();
  /** 当前请求的 order 底（请求耦合：第 n 帧 order = 请求order + n）。 */
  private base = 0;
  /** 当前请求已产出的帧数。 */
  private seq = 0;

  /** 当前服务端的 order ，会根据请求耦合规则自动增加或者重置。 */
  protected order = 0;
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

  /** 锚定一次请求：该请求产出的第 n 帧 order = 请求order + n（首帧即 order+1）。 */
  beginRequest(reqOrder: number): void {
    this.base = reqOrder;
    this.seq = 0;
  }

  /**
   * 按请求耦合规则入队一条 S2C：order = 请求order + 产出次序(1,2,...)。
   * @param body 已 wrap 好 dynproto 头的业务体。
   * @returns 本次为这条帧分配的 order。
   */
  pushFrame(msgId: number, body: Buffer,order?:number): number {
    this.seq += 1;
    // const order = this.base + this.seq;
    // this.order += 1;
    let newOrder = this.order;
    if(order){
      newOrder = order;
    }
    this.pending.push({ msgId, order: newOrder, body });
    return newOrder;
  }

  /** 以显式 order 入队（特殊帧，如心跳 PINGPONG 沿用约定 order，不走 +1）。 */
  enqueue(msgId: number, order: number, body: Buffer): void {
    this.pending.push({ msgId, order, body });
  }

  /** 取走并清空待下发帧（由 WsGateway 下发到 socket）。空队列返回空数组。 */
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
  process(
    req: Record<string, unknown>,
    msgId: number,
    order: number,
    controller: MessageController,
  ): S2CFrame[] {
    // 应答器判断：未注册该消息号 → 不应答
    const responder = controller.AutoResponser[msgId as MESSAGE_ID] as any | undefined;
    if (!responder){
      this.logger?.warn('client', `[${this.connId}] 处理 req#${msgId} 异常: 未注册应答器`);
      return [];
    };

    /**
     * 对重连或者首次连入，同步Order
     */
    if(CONNECT_MESSAGE_IDS.includes(msgId)){
      // this.order = order;
    }

    // ① Handle：取得返回对象（返回对象可能依赖/修改本客户端状态）
    let rep: Record<string, unknown>;
    try {
      rep = responder.Handle(req, this) ?? {};
    } catch (e) {
      this.logger?.warn('client', `[${this.connId}] 处理 req#${msgId} 异常: ${(e as Error).message}`);
      return [];
    }

    // ② 编码 REP → dynproto 体 → 记账入队（order 由本对象按「请求+产出次序」分配）
    const repSchema = get(Number(responder.recId));
    if (!repSchema) return [];
    try {
      const inner = encodeMessage(repSchema, rep);
      this.beginRequest(order);
      this.pushFrame(Number(responder.recId), wrapDynProtoAuto(inner),order+1);
      return this.drainPending();
    } catch (e) {
      this.logger?.warn('client', `[${this.connId}] 编码 rec#${responder.recId} 失败: ${(e as Error).message}`);
      return [];
    }
  }
}