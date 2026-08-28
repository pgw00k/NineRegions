/**
 * 基础应答器
 * @template REQ - 请求类型
 * @template REP - 响应类型
 */
export interface IHandleBase {
  /**
   * 处理请求
   * @param req - 请求
   * @returns 响应
   */
  Handle(req: any): any; 
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
   * @returns 响应
   */
  Handle(req: REQ): REP;
}

