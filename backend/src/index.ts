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
import { ConnManager } from './net/ConnManager';
import { HttpServer } from './http/HttpServer';
import { AppDataSource } from './data/DataSource';

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
  // 多客户端：ConnManager 统一登记每个连接的 Client，路由按 connId 定位上下文。
  const conns = new ConnManager(logger);
  const router = new MessageRouter(conns, logger);
  const gateway = new WsGateway(logger);
  gateway.setOnConnCreate((connId) => conns.create(connId));
  gateway.setOnConnClose((connId) => conns.remove(connId));
  gateway.setOnC2S((connId, frame) => router.route(connId, frame.msgId, frame.order, frame.body));

  // 外围：客户端登录 HTTP 仿真层。
  const http = new HttpServer(logger);

    // 初始化数据库连接并启动服务器
  AppDataSource.initialize()
    .then(() => {
      logger.info('boot', '数据库已连接');
      return gateway.start();
    })
    .then(() => {
      logger.info('boot', 'WS服务已启动');
      return http.start();
    })
    .then(() => {
      logger.info('boot', 'HTTP服务已启动');
      logger.info('boot', '服务装配完成');
    })
    .catch((err) => {
      logger.error('boot', `初始化失败:${err}`);
    })
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});