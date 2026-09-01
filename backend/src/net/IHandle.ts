import { Client } from './Client';
export { Client };

/**
 * 基础应答器
 * @template REQ - 请求类型
 * @template REP - 响应类型
 */
export interface IHandleBase {
  /**
   * 处理请求
   * @param req - 请求
   * @param client - 当前客户端上下文（多人化：据其 uid/props 读写该玩家状态）
   * @returns 响应
   */
  Handle(req: any, client?: Client): any;
}

/**
 * 基础应答器
 * @template REQ - 请求类型
 * @template REP - 响应类型
 */
export interface IHandle<REQ, REP> extends IHandleBase {
  /**
   * 处理请求
   * @param req - 请求
   * @param client - 当前客户端上下文（受控于 ConnManager，非必传）
   * @returns 响应
   */
  Handle(req: REQ, client?: Client): REP;
}

export interface IResponderPair {
  reqId: number;
  recId: number;
}