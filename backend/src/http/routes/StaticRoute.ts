/**
 * StaticRoute.ts — /res/ 静态目录服务（对齐 4010 capture_server 的 static_root + strip_prefix）。
 *
 * 映射（与 capture_server.py 相同）：
 *   GET /res/<rel> → static/<rel>（strip 掉 res/ 前缀），Content-Type 按扩展名推断。
 *
 * 额外回退（本地布局兼容）：static/<rel> 未命中时，尝试 static/<basename>
 * —— 用户把 patchlist0.12.786.json 放在 static/ 根目录，而客户端按官方路径
 * 请求 /res/pc/patchlist0.12.786.json，回退后两者都能命中。
 *
 * 安全：路径 normalize 后必须仍在 static 目录内（防 ../ 穿越），否则 404。
 * Range 续传（patchlist 分片下载）由 HttpContext.sendFile 处理。
 */
import * as path from 'path';
import * as fs from 'fs';
import { PROJECT_ROOT } from '../../config/env';
import { HttpContext } from '../HttpContext';

const STATIC_ROOT = path.resolve(PROJECT_ROOT, 'static');

export function staticHandler(ctx: HttpContext): void {
  // /res/xxx → 去掉前导 '/res' 得到相对路径
  const rel = ctx.pathname.replace(/^\/res\/?/, '');
  if (!rel) return void ctx.text('not found', 404);

  const file = resolveSafe(rel);
  if (file && fs.existsSync(file) && fs.statSync(file).isFile()) {
    return void ctx.sendFile(file, contentTypeFor(file));
  }

  // 回退：static/<basename>（兼容文件放根目录的布局）
  const base = path.basename(rel);
  const fallback = path.join(STATIC_ROOT, base);
  if (isInside(STATIC_ROOT, fallback) && fs.existsSync(fallback) && fs.statSync(fallback).isFile()) {
    return void ctx.sendFile(fallback, contentTypeFor(fallback));
  }
  ctx.text('not found', 404);
}

/** normalize 后必须仍在 STATIC_ROOT 内，返回绝对路径；越界返回 null。 */
function resolveSafe(rel: string): string | null {
  const abs = path.resolve(STATIC_ROOT, rel);
  if (!isInside(STATIC_ROOT, abs)) return null;
  return abs;
}

function isInside(root: string, abs: string): boolean {
  return abs === root || abs.startsWith(root + path.sep);
}

/** 简单扩展名 → Content-Type 映射（覆盖补丁/资源常见类型）。 */
function contentTypeFor(file: string): string {
  const ext = path.extname(file).toLowerCase();
  switch (ext) {
    case '.json':
      return 'application/json; charset=utf-8';
    case '.txt':
      return 'text/plain; charset=utf-8';
    case '.zip':
      return 'application/zip';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.webp':
      return 'image/webp';
    case '.bytes':
      return 'application/octet-stream';
    case '.unity3d':
      return 'application/octet-stream';
    case '.manifest':
      return 'application/octet-stream';
    default:
      return 'application/octet-stream';
  }
}
