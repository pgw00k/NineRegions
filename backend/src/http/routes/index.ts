/**
 * routes/index.ts — HTTP 路由登记表（集中注册，新增端点只改这里）。
 *
 * 注册方式：
 *  - `use(pattern, handler)`：不限制方法（express app.use 风格），段前缀匹配，
 *    可带 `:param` 动态段 —— 同一路径客户端可能 GET/POST 混打，统一用 use；
 *  - `register(method, pattern, handler)`：确实需要限定方法时才用。
 *
 * 匹配优先级（对齐 4010 responses.json「键长降序」）：段数多 > 动态段少 > 段位精确。
 *
 * 与 4010 capture_server 行为对齐表（responses.json，2026-08-26 快照）：
 *   GET  /r、/r/、/r/1.0.50/ver、/r/1.0.50/lver … → resp/ver.json（/r 前缀兜底）
 *   GET|POST /r/:ver/statistics                    → static/patchlist0.12.786.json（用户要求）
 *   POST /r/:ver/login                             → login JSON（双大小写变体）
 *   GET  /r/:ver/ip                                → {"country_short":"CN","city":"Local"}
 *   POST /r/:ver/queryBindRole                     → {"roles":"[]"}
 *   POST /r/:ver/device                            → 落入 /r 前缀兜底 → ver.json
 *   /res/<rel>                                     → static/<rel>（静态目录，Range 续传）
 *   /redirector.txt /version.txt /version_s.txt /newfiler.txt /newfiler_s.txt → 文本
 */
import { HttpRouter } from '../HttpRouter';
import { verHandler } from './VerRoute';
import { loginHandler } from './LoginRoute';
import { statisticsHandler } from './StatisticsRoute';
import { staticHandler } from './StaticRoute';
import {
  emptyTextHandler,
  ipHandler,
  queryBindRoleHandler,
  redirectorHandler,
  versionTextHandler,
} from './MiscRoute';

export function registerRoutes(router: HttpRouter): void {
  // 版本下发（保留原 GET /ver 入口）
  router.use('/ver', verHandler);

  // 登录链路：/r 前缀兜底返回 ver.json（对齐 4010：ver/lver/device 等都落这里）
  router.use('/r/:ver/statistics', statisticsHandler);
  router.use('/r/:ver/login', loginHandler);
  router.use('/r/:ver/ip', ipHandler);
  router.use('/r/:ver/queryBindRole', queryBindRoleHandler);
  // 顶级 /login 保留（原 HttpServer 入口；4010 实证客户端实际打 /r/1.0.50/login）
  router.use('/login', loginHandler);
  router.use('/r', verHandler);

  // 静态资源（补丁列表 / 资源包，Range 续传）
  router.use('/res', staticHandler);

  // 补丁器文本端点（对齐 responses.json）
  router.use('/redirector.txt', redirectorHandler);
  router.use('/version.txt', versionTextHandler);
  router.use('/version_s.txt', versionTextHandler);
  router.use('/newfiler.txt', emptyTextHandler);
  router.use('/newfiler_s.txt', emptyTextHandler);
}
