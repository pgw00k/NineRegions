/**
 * MiscRoute.ts — 对齐 4010 capture_server responses.json 的其余小规则。
 *
 * 逐条对照（responses.json，2026-08-26 快照）：
 *  - /redirector.txt → 'http://127.0.0.1:4010/res/'（重定向器，指向资源服务器）
 *  - /version.txt、/version_s.txt → '0.12.786'
 *  - /newfiler.txt、/newfiler_s.txt → ''（增量文件列表，空 = 无新增）
 *  - GET /r/:ver/ip → {"country_short":"CN","city":"Local"}
 *  - POST /r/:ver/queryBindRole → {"roles":"[]"}（实名/绑定角色查询）
 */
import { HttpContext } from '../HttpContext';

export function redirectorHandler(ctx: HttpContext): void {
  ctx.text('http://127.0.0.1:4010/res/');
}

export function versionTextHandler(ctx: HttpContext): void {
  ctx.text('0.12.786');
}

export function emptyTextHandler(ctx: HttpContext): void {
  ctx.text('');
}

export function ipHandler(ctx: HttpContext): void {
  ctx.json({ country_short: 'CN', city: 'Local' });
}

export function queryBindRoleHandler(ctx: HttpContext): void {
  ctx.json({ roles: '[]' });
}
