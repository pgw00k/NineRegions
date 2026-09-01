/**
 * ConnManager.ts — 多客户端连接管理器。
 *
 * 每个连接对应一个 `Client` 对象（见 Client.ts，存 uid + 通用属性槽）。本类负责：
 *  - 以 connId 为键维护「活跃连接 ↔ Client」映射；
 *  - 当客户端首条消息带上 uid/userid 时，把 uid 绑定到该 Client，并建立 uid → Client 索引，
 *    从而既能按连接、也能按玩家 ID 定位同一份状态；
 *  - 连接断开时清理映射（重连可再绑定同一 uid，状态由各业务逻辑自持）。
 *
 * 设计要点：这里只管理「连接 ↔ 身份 + 状态归属」，不持有任何业务字段；
 * 具体玩家数据（背包/牌组/会话）由各逻辑写入 Client.props，或由其自带的储物按 uid 拉取。
 */
import { Client } from './Client';
import { Logger } from '../core/Logger';

export class ConnManager {
  /** connId → Client（活跃连接）。 */
  private readonly byConn = new Map<string, Client>();
  /** uid → Client（已绑定身份的连接；重连时旧索引会被新连接覆盖）。 */
  private readonly byUid = new Map<string, Client>();
  /** 日志器（可选，透传给创建出的 Client）。 */
  private readonly logger?: Logger;

  constructor(logger?: Logger) {
    this.logger = logger;
  }

  /** 新连接建立：创建并登记一个 Client。 */
  create(connId: string): Client {
    let c = this.byConn.get(connId);
    if (!c) {
      c = new Client(connId, this.logger);
      this.byConn.set(connId, c);
    }
    return c;
  }

  /** 按连接 ID 取 Client（连接可能尚未绑定 uid）。 */
  get(connId: string): Client | undefined {
    return this.byConn.get(connId);
  }

  /** 按玩家 ID 取当前在线 Client（多开时返回最后绑定该 uid 的连接）。 */
  byUidLookup(uid: string): Client | undefined {
    return this.byUid.get(uid);
  }

  /**
   * 把 uid 绑定到 connId 对应的 Client，并维护 uid 索引：
   *  - 若该 Client 已绑其他 uid，先解除旧索引；
   *  - 若该 uid 已被另一连接占用（断线重连场景），旧连接的 uid 索引让位给新连接。
   */
  bind(connId: string, uid: string): boolean {
    const c = this.byConn.get(connId);
    if (!c) return false;
    if (c.uid === uid) return true;

    if (c.uid) {
      if (this.byUid.get(c.uid) === c) this.byUid.delete(c.uid);
    }
    const holder = this.byUid.get(uid);
    if (holder && holder !== c) this.byUid.delete(uid);

    c.setUid(uid);
    this.byUid.set(uid, c);
    return true;
  }

  /** 连接断开：从两张索引中移除该连接。 */
  remove(connId: string): void {
    const c = this.byConn.get(connId);
    this.byConn.delete(connId);
    if (c && c.uid && this.byUid.get(c.uid) === c) {
      this.byUid.delete(c.uid);
    }
  }

  /** 当前在线连接数（仅当需要统计/广播时才用到）。 */
  get size(): number {
    return this.byConn.size;
  }
}