/**
 * index.ts — 服务装配入口。
 *
 * 职责收敛为「装配 + 启动」，不再内嵌任何业务逻辑：
 *   - 核心链路：WsGateway（C2S 解密）→ MessageRouter2（路由应答）；
 *   - 外围：HttpServer（客户端登录仿真）随服务一起启动。
 */
import { Logger } from './core/Logger';
import { MessageRouter } from './messages/MessageRouter';
import { WsGateway } from './net/WsGateway';
import { HttpServer } from './http/HttpServer';

process.title = 'nine-regions-backend';

process.on('uncaughtException', (e) => {
  // eslint-disable-next-line no-console
  console.error('[uncaughtException]', e);
  process.exit(1);
});
process.on('unhandledRejection', (e) => {
  // eslint-disable-next-line no-console
  console.error('[unhandledRejection]', e);
  process.exit(1);
});

async function main(): Promise<void> {
  const logger = new Logger('boot');

  // 核心链路：C2S 解密（gateway）→ 路由应答（MessageRouter）→ S2C。
  const router = new MessageRouter(logger);
  const gateway = new WsGateway(logger);
  gateway.setOnC2S((connId, frame) => router.route(connId, frame.msgId, frame.order, frame.body));
  await gateway.start();

  // 外围：客户端登录 HTTP 仿真层。
  const http = new HttpServer(logger);
  await http.start();

  logger.info('boot', '服务装配完成');
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});