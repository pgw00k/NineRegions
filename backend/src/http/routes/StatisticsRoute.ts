/**
 * StatisticsRoute.ts — /r/:ver/statistics 登录打点。
 *
 * 实证（capture_log.jsonl / url_trace_20260825b.log）：
 *  - 客户端 GamePatcher.UnityWebPost 登录各阶段上报，路径含版本号 → 用 :ver 动态段；
 *    同一路径 GET / POST 都会打（capture 中 GET 5 次 + POST 25 次）→ 用 use() 不限制方法；
 *  - Content-Type: application/x-www-form-urlencoded，body 形如
 *    `userid=a4d274350a70d236d46f0429658cf5412ba0ba60&loginstep=200013`；
 *  - 客户端 fire-and-forget，不检查响应（4010 record server 回 404 流程照常走完）。
 *
 */
import * as path from 'path';
import * as fs from 'fs';
import { PROJECT_ROOT } from '../../config/env';
import { HttpContext } from '../HttpContext';

/**
 * 登录打点函数，将登录过程中的各阶段上报记录到日志中
 */
export async function statisticsHandler(ctx: HttpContext): Promise<void> {
  const form = await ctx.readForm();

  // console.log(form);

  // 打点内容本地无需真实上报，记日志便于排查登录链路
  ctx.logStatistics(form);
  ctx.json({},200);
}
