/**
 * index.ts — 后端服务入口，统一编排各子系统。
 *
 * 架构（零运行时依赖，便于 Docker 单容器部署）：
 *  - SchemaRegistry + ProtobufEncoder：解析 pack_msg，按字段号编码 mock；
 *  - MessageRegistry：消息号 <-> protobuf 类型 映射（REQ/REP 配对）；
 *  - OrderTracker：逐连接 S2C order 严格递增（客户端 OnSetOrder 要求 order-logicOrder==1）；
 *  - WsGateway：RFC6455 网关，握手回显 xj，下发 msg1，下发 S2C；
 *  - PlainChannel：UDP 明文侧信道，收 Frida 明文帧 → 路由 → 经 WsGateway 下发；
 *  - HttpServer：仿真 /ver、/login；
 *  - Storage：内存实现（redis/database 预留桩）。
 *
 * 注：C2S 加密为 IFix JIT 内联，静态不可还原；本服务依赖 Frida 明文侧信道
 * （relay 在宿主机 Windows 跑，不进容器），UDP 转发到 :9002 驱动应答。
 */
import { Config, PACK_MSG_PATH_ABS, REGISTRY_PATH_ABS } from './config/env';
import { Logger } from './core/Logger';
import { SchemaRegistry } from './proto/SchemaRegistry';
import { ProtobufEncoder } from './proto/ProtobufEncoder';
import { OrderTracker } from './net/OrderTracker';
import { MessageRegistry } from './messages/MessageRegistry';
import { MessageRouter } from './messages/MessageRouter';
import { HandlerServices, INTERNAL_MSG_IDS } from './messages/types';
import { PveSettlementService } from './messages/PveSettlement';
import { UserStateStore } from './state/UserState';
import { createStorage } from './storage/Storage';
import { WsGateway } from './net/WsGateway';
import { PlainChannel } from './net/PlainChannel';
import { HttpServer } from './http/HttpServer';
import { wrapDynProtoAuto } from './net/FrameCodec';
import { Buffer } from 'buffer';

async function main(): Promise<void> {
  // Windows 控制台窗口标题（便于在任务栏/窗口区分，配合「可见窗口」运行约定）
  try {
    process.title = 'NineRegions Local Server (WS:8800 UDP:9002 HTTP:8080)';
  } catch {
    /* ignore */
  }
  const logger = new Logger('boot');

  // ★崩溃兜底：uncaughtException / unhandledRejection 落盘 server.log + 窗口双通道，
  // 防止「进程硬死无痕」（2026-08-24 02:12 实证：服务 18:12:42 无声死亡，客户端断线）。
  const fatal = (tag: string, err: unknown): void => {
    const stack = err instanceof Error ? err.stack : String(err);
    const line = `[FATAL] ${tag}: ${stack}`;
    try {
      // 直接 append 日志文件（不依赖 Logger，避免崩溃发生在 Logger 内部时死循环）
      const fs = require('fs') as typeof import('fs');
      fs.appendFileSync('logs/server.log', `\n${line}\n`, 'utf-8');
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line no-console
    console.error(line);
  };
  process.on('uncaughtException', (e) => fatal('uncaughtException', e));
  process.on('unhandledRejection', (r) => fatal('unhandledRejection', r));


  logger.info(
    'boot',
    `XJ 本地服务器启动 | WS=:${Config.wsPort} UDP=:${Config.plainUdpPort} HTTP=:${Config.httpPort} | STORAGE=${Config.storageDriver}`,
  );

  // 协议层
  const schema = SchemaRegistry.load(PACK_MSG_PATH_ABS);
  logger.info('boot', `schema 加载完成: ${schema.messageCount} 个消息/类型`);
  const encoder = new ProtobufEncoder(schema);
  const orders = new OrderTracker();
  const registry = MessageRegistry.load(REGISTRY_PATH_ABS);
  logger.info('boot', `消息注册表加载完成: ${registry.size} 条`);

  // 存储
  const storage = createStorage(Config, logger);

  // 网络 / HTTP 子系统（先建网关，供推送闭包使用）
  const gateway = new WsGateway(logger, orders);

  // 服务端主动推送：order 自动递增（以最近 req order 为基准），逻辑消息自动包 dynproto
  const push = (connId: string, msgId: number, innerPbuf: Buffer): void => {
    const order = orders.next(connId, msgId, orders.lastReqOrder(connId));
    const body = INTERNAL_MSG_IDS.has(msgId) ? innerPbuf : wrapDynProtoAuto(innerPbuf);
    gateway.sendS2C({ msgId, order, body });
  };

  // PVE 结算推送状态机：驱动链 lua NetMsg_PVECompletePush(15003) → Guide_PVEComplete
  const pve = new PveSettlementService(
    (connId, inner) => push(connId, 15003, inner),
    () => {
      const s = schema.getByShortName('PushPVEComplete');
      if (!s) throw new Error('schema 缺 PushPVEComplete');
      // 教程关 chapter=1 / stage=10001 / isWin=1（参考 NewbieLogic.CreatePVERoom(1,0,10001)）
      // 附带最小奖励（PrizeInfoSimple#1 prize=[{1:itemId, 2:count}]），结算界面显示奖励并走 InitReward→继续
      return encoder.encode(s, { 1: 1, 2: 10001, 6: 1, 3: { 1: [{ 1: 1001, 2: 100 }] } });
    },
    logger,
  );

  // 按用户 ID 的会话状态（重连恢复战斗 / 起名 / 教程完成）
  const users = new UserStateStore();

  // 共享服务 + 路由
  const services: HandlerServices = { schema, encoder, orders, registry, storage, logger, config: Config, push, pve, users };
  const router = new MessageRouter(services);

  const channel = new PlainChannel(logger, {
    getActiveConnId: () => gateway.getActiveConnId(),
    sendS2C: (f) => gateway.sendS2C(f),
    onMessage: (connId, msgId, order, body) => router.route(connId, msgId, order, body),
  });
  const http = new HttpServer(logger);

  // 连接断开时清理 PVE 结算状态 + 解绑连接级用户映射（用户级状态保留供重连）
  gateway.setOnConnClose((connId) => {
    pve.reset(connId);
    users.unbind(connId);
  });
  // ★C2S 解密直读（脱离 Frida）：WS 线上密文 → 解密 → 路由应答（与 UDP 明文通道同链路）
  gateway.setOnC2S((connId, frame) => router.route(connId, frame.msgId, frame.order, frame.body));

  await gateway.start();
  await channel.start();
  await http.start();
  logger.info('boot', '全部子系统已启动（等待客户端连接 + Frida 明文侧信道）');

  const shutdown = async (sig: string): Promise<void> => {
    logger.info('boot', `收到 ${sig}，正在优雅关闭...`);
    await gateway.stop();
    await channel.stop();
    await http.stop();
    process.exit(0);
  };
  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

main().catch((e) => {
  // 启动期异常直接打印并退出
  // eslint-disable-next-line no-console
  console.error('[fatal]', e);
  process.exit(1);
});
