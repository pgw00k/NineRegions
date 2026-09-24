/**
 * AdminRoute.ts — 仅本地开发/自动化测试使用的控制端点，不属于游戏协议。
 *
 * 存在的意义：客户端一次「启动 → 登录 → 匹配 → 进战斗」要几十秒，而服务端改代码只需重启
 * 进程（内存里的 BattleRoom 会随进程消失，但弱重连测试要求房间仍在）。
 * 因此这里提供一个主动掐连接的手段，让客户端自己走 20001 弱重连回到当前回合。
 */
import { WsGateway } from '../../net/WsGateway';
import { HttpContext } from '../HttpContext';

/** GET /admin/dropConn —— 断开所有客户端 WS 连接，触发其战斗弱重连 */
export function dropConnHandler(ctx: HttpContext): void {
  const dropped = WsGateway.Active ? WsGateway.Active.dropAllConnections() : 0;
  ctx.json({ dropped });
}
