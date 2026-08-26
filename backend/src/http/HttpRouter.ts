/**
 * HttpRouter.ts — 极简路由表（零运行时依赖）。
 *
 * 两种注册方式（对齐 capture_server.py 的匹配语义）：
 *  - `register(method, pattern, handler)`：绑定具体 HTTP 方法，全段精确匹配；
 *  - `use(pattern, handler)`：不限制方法（express `app.use` 风格），**段前缀匹配**
 *    —— 请求路径以 pattern 的段为前缀即命中（可带 `:param` 动态段）。
 *
 * 匹配优先级（与 4010 responses.json「键按长度降序匹配」一致）：
 *  1. 段数多的规则优先（更具体的先匹配）；
 *  2. 段数相同，动态段少的优先；
 *  3. 逐段比较，精确段优先于动态段。
 * 同分时按注册顺序（Array.prototype.sort 稳定）。
 *
 * 用法：
 *   router.use('/r/:ver/statistics', statisticsHandler);   // GET/POST 都命中
 *   router.use('/r', verHandler);                          // /r 前缀兜底
 *   router.register('POST', '/login', loginHandler);       // 仅 POST
 */
import { HttpContext } from './HttpContext';

/** 路由处理器：同步或异步皆可；响应由 handler 通过 ctx 写出。 */
export type HttpHandler = (ctx: HttpContext) => void | Promise<void>;

interface RouteEntry {
  /** 注册方式：'exact' = 绑定方法精确匹配；'prefix' = use() 任意方法前缀匹配 */
  kind: 'exact' | 'prefix';
  /** 绑定方法（exact 才有；prefix 恒为 undefined，表示任意方法） */
  method?: string;
  /** 原始模式，如 '/r/:ver/statistics' */
  pattern: string;
  /** 按 '/' 切分的段（保留 :param 原文） */
  segments: string[];
  /** 该条路由包含的动态参数名列表 */
  params: string[];
  handler: HttpHandler;
}

export class HttpRouter {
  /** method(大写) -> 该方法的 exact 路由；use() 路由单独存 */
  private readonly exactRoutes = new Map<string, RouteEntry[]>();
  private readonly prefixRoutes: RouteEntry[] = [];

  /** 注册绑定方法的路由（全段精确匹配）。 */
  register(method: string, pattern: string, handler: HttpHandler): void {
    const m = method.toUpperCase();
    const entry = makeEntry('exact', m, pattern, handler);
    let list = this.exactRoutes.get(m);
    if (!list) {
      list = [];
      this.exactRoutes.set(m, list);
    }
    list.push(entry);
    list.sort(compareRoutes);
  }

  /** 注册不限制方法的路由（段前缀匹配，express app.use 语义）。 */
  use(pattern: string, handler: HttpHandler): void {
    this.prefixRoutes.push(makeEntry('prefix', undefined, pattern, handler));
    this.prefixRoutes.sort(compareRoutes);
  }

  /**
   * 分发请求。命中返回 true；未命中返回 false（调用方应回 404）。
   * 先尝试精确（方法 + 全段），未命中再走 use() 前缀。
   */
  dispatch(method: string, pathname: string, ctx: HttpContext): boolean {
    const m = method.toUpperCase();
    const segs = splitPath(pathname);

    const exact = this.exactRoutes.get(m);
    if (exact) {
      for (const r of exact) {
        const params = matchSegments(r.segments, segs, false);
        if (params === null) continue;
        fire(r, params, ctx);
        return true;
      }
    }
    for (const r of this.prefixRoutes) {
      const params = matchSegments(r.segments, segs, true);
      if (params === null) continue;
      fire(r, params, ctx);
      return true;
    }
    return false;
  }

  /** 当前已注册路由清单（调试/日志用）。 */
  list(): string[] {
    const out: string[] = [];
    for (const [m, list] of this.exactRoutes) {
      for (const r of list) out.push(`${m} ${r.pattern}`);
    }
    for (const r of this.prefixRoutes) out.push(`ANY ${r.pattern}`);
    return out.sort();
  }
}

function makeEntry(
  kind: RouteEntry['kind'],
  method: string | undefined,
  pattern: string,
  handler: HttpHandler,
): RouteEntry {
  const segments = splitPath(pattern);
  const params: string[] = [];
  for (const s of segments) {
    if (s.startsWith(':')) params.push(s.slice(1));
  }
  return { kind, method, pattern, segments, params, handler };
}

function fire(r: RouteEntry, params: Record<string, string>, ctx: HttpContext): void {
  ctx.params = params;
  const out = r.handler(ctx);
  if (out && typeof (out as Promise<unknown>).catch === 'function') {
    (out as Promise<unknown>).catch((e: unknown) => ctx.onHandlerError(r.pattern, e));
  }
}

/** 把 '/a/b/:x' 切成 ['', 'a', 'b', ':x']；空路径按 '/' 处理。 */
function splitPath(p: string): string[] {
  if (!p || p === '/') return ['', ''];
  const segs = p.split('/');
  if (segs[segs.length - 1] === '') segs.pop();
  return segs;
}

/**
 * 段匹配。
 * @param prefix true = 段前缀匹配（请求段数 >= pattern 段数，前 N 段匹配即可）
 * @returns 动态参数表；不匹配返回 null
 */
function matchSegments(
  pat: string[],
  segs: string[],
  prefix: boolean,
): Record<string, string> | null {
  if (prefix ? segs.length < pat.length : segs.length !== pat.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < pat.length; i++) {
    const p = pat[i];
    if (p.startsWith(':')) {
      params[p.slice(1)] = segs[i];
    } else if (p !== segs[i]) {
      return null;
    }
  }
  return params;
}

/**
 * 排序：段数多优先（更具体）；同段数动态段少优先；同动态段数逐段比较，精确段优先。
 */
function compareRoutes(a: RouteEntry, b: RouteEntry): number {
  const n = a.segments.length - b.segments.length;
  if (n !== 0) return -n; // 段数多（更具体）的排前面
  const dyn = a.params.length - b.params.length;
  if (dyn !== 0) return dyn;
  const len = Math.min(a.segments.length, b.segments.length);
  for (let i = 0; i < len; i++) {
    const pa = a.segments[i].startsWith(':') ? 1 : 0;
    const pb = b.segments[i].startsWith(':') ? 1 : 0;
    if (pa !== pb) return pa - pb;
  }
  return a.pattern.localeCompare(b.pattern);
}
