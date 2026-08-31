/**
 * luaMeta.ts — 解析 LUA/NetMsg 下 NetMsg_*.lua 的 NetMetaDefine，得到「请求/响应配对」。
 *
 * 供 generate_res.ts（生成 backend 消息处理骨架）与 generate_gRPC.ts（生成 gRPC 工程）
 * 共用，避免两处重复维护 Lua 解析逻辑。逻辑移植自 tools/extract_registry.py。
 *
 * 数据模型：
 *  - reqId/recId 支持 `MESSAGE_ID.XXX` 引用、数字字面量、nil；未知引用回退 -1。
 *  - reqProto/recvProto 为类型短名（如 "EnterGameRequest"），是否真实存在由调用方校验。
 */
import * as fs from 'fs';
import * as path from 'path';

/** 解析 MESSAGE_ID.lua，返回 { 消息名: 数字 }。 */
export function parseMessageIdLua(file: string): Map<string, number> {
  const table = new Map<string, number>();
  if (!fs.existsSync(file)) {
    console.warn(`[warn] MESSAGE_ID.lua 不存在: ${file}`);
    return table;
  }
  const text = fs.readFileSync(file, 'utf-8');
  const pat = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(-?\d+)/gm;
  let m: RegExpExecArray | null;
  while ((m = pat.exec(text)) !== null) {
    table.set(m[1], Number(m[2]));
  }
  return table;
}

/** 从 open_idx（须为 open_ch）起，返回到匹配 close_ch 的子串（含两端）。 */
function extractBalanced(s: string, openIdx: number, openCh: string, closeCh: string): string {
  let depth = 0;
  for (let i = openIdx; i < s.length; i++) {
    const c = s[i];
    if (c === openCh) depth++;
    else if (c === closeCh) {
      depth--;
      if (depth === 0) return s.slice(openIdx, i + 1);
    }
  }
  return s.slice(openIdx);
}

/** 判断 idx 处是否位于整行注释中。 */
function isCommented(text: string, idx: number): boolean {
  const lineStart = text.lastIndexOf('\n', idx - 1) + 1;
  return text
    .slice(lineStart, idx)
    .trim()
    .startsWith('--');
}

/** 提取所有未注释的 NetMetaDefine(...) 内部第一个 {...} 表文本。 */
export function parseMetaBlocks(text: string): string[] {
  const blocks: string[] = [];
  const key = 'NetMetaDefine(';
  let start = 0;
  for (;;) {
    const p = text.indexOf(key, start);
    if (p === -1) break;
    start = p + key.length;
    if (isCommented(text, p)) continue;
    const paren = text.indexOf('(', p);
    if (paren === -1) continue;
    const full = extractBalanced(text, paren, '(', ')');
    const brace = full.indexOf('{');
    if (brace === -1) continue;
    blocks.push(extractBalanced(full, brace, '{', '}'));
  }
  return blocks;
}

export type MetaValue =
  | { kind: 'msgIdRef'; name: string } // MESSAGE_ID.X
  | { kind: 'number'; value: number }
  | { kind: 'string'; value: string }
  | { kind: 'nil' };

/** 解析扁平 Lua 表里的 key = value 对。 */
export function parseKv(inner: string): Map<string, MetaValue> {
  const out = new Map<string, MetaValue>();
  for (const rawLine of inner.split(/\r?\n/)) {
    const line = rawLine.split('--')[0];
    const mm = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+?)\s*,?\s*$/.exec(line);
    if (!mm) continue;
    const k = mm[1];
    const v = mm[2].trim();
    if (v.startsWith('"') && v.endsWith('"')) out.set(k, { kind: 'string', value: v.slice(1, -1) });
    else if (v.startsWith("'") && v.endsWith("'")) out.set(k, { kind: 'string', value: v.slice(1, -1) });
    else if (v.startsWith('MESSAGE_ID.')) out.set(k, { kind: 'msgIdRef', name: v.slice('MESSAGE_ID.'.length) });
    else if (v === 'nil') out.set(k, { kind: 'nil' });
    else if (/^-?\d+$/.test(v)) out.set(k, { kind: 'number', value: Number(v) });
    else out.set(k, { kind: 'string', value: v });
  }
  return out;
}

export interface MsgIdInfo {
  /** 类字段表达式，例如 `MESSAGE_ID.GET_ACHIEVE_REWARD_REQ`，缺省为数字 `-1`。 */
  enumExpr: string;
  /** 数值（用于 > 0 判断）。缺省为 undefined。 */
  num: number | undefined;
  /** 当为未知的 MESSAGE_ID.XXX 引用时会记录该名字（用于注释说明）。 */
  unknown?: string;
}

/**
 * 把 NetMetaDefine 里的 reqId/recId 值解析成「枚举表达式 + 数值」。
 * 支持 MESSAGE_ID.XXX 引用或数字字面量；未知引用一律回退为 -1。
 */
export function resolveMsgId(
  val: MetaValue | undefined,
  nameToNum: Map<string, number>,
  idToName: Map<number, string>,
): MsgIdInfo {
  if (val && val.kind === 'msgIdRef') {
    const n = val.name;
    const num = nameToNum.get(n);
    if (num === undefined) return { enumExpr: '-1', num: -1, unknown: n }; // 引用名不存在于 MESSAGE_ID.lua
    return { enumExpr: `MESSAGE_ID.${n}`, num };
  }
  if (val && val.kind === 'number') {
    const name = idToName.get(val.value);
    if (name) return { enumExpr: `MESSAGE_ID.${name}`, num: val.value };
    return { enumExpr: String(val.value), num: val.value };
  }
  return { enumExpr: '-1', num: -1 };
}

export type MsgId = MsgIdInfo & { num: number };

export interface Meta {
  tagName: string;
  reqId: MsgId;
  reqProto: string;
  recId: MsgId;
  recvProto: string;
  /** 引用了已知类型集合中不存在的 proto 类型名时置 true（用于注释说明）。 */
  reqProtoUnknown: string | undefined;
  recvProtoUnknown: string | undefined;
}

/** 把 reqId/recId 的数值补全（若引用形式则查 nameToNum）。 */
export function buildMeta(
  kv: Map<string, MetaValue>,
  nameToNum: Map<string, number>,
  idToName: Map<number, string>,
  protoNames: Set<string>,
): Meta {
  const reqInfo = resolveMsgId(kv.get('reqId'), nameToNum, idToName);
  const recInfo = resolveMsgId(kv.get('recId'), nameToNum, idToName);
  const tagName = (kv.get('tagName')?.kind === 'string' && (kv.get('tagName') as { value: string }).value) || '';
  const rawReqProto = kv.get('reqProto')?.kind === 'string' ? (kv.get('reqProto') as { value: string }).value : '';
  const rawRecvProto = kv.get('recvProto')?.kind === 'string' ? (kv.get('recvProto') as { value: string }).value : '';
  const reqProto = rawReqProto && protoNames.has(rawReqProto) ? rawReqProto : '';
  const recvProto = rawRecvProto && protoNames.has(rawRecvProto) ? rawRecvProto : '';
  return {
    tagName,
    reqId: { ...reqInfo, num: reqInfo.num ?? -1 },
    reqProto,
    recId: { ...recInfo, num: recInfo.num ?? -1 },
    recvProto,
    reqProtoUnknown: rawReqProto && !reqProto ? rawReqProto : undefined,
    recvProtoUnknown: rawRecvProto && !recvProto ? rawRecvProto : undefined,
  };
}

/**
 * 收集 NetMsg 目录下所有 NetMsg_*.lua，逐个解析 NetMetaDefine。
 * 返回 { 文件名(base, 不带扩展), Meta } 列表。
 */
export function collectNetMessages(luaRoot: string): { fileName: string; meta: Meta; luaPath: string }[] {
  const nameToNum = parseMessageIdLua(path.join(luaRoot, 'MESSAGE_ID.lua'));
  const idToName = new Map<number, string>();
  for (const [k, v] of nameToNum) idToName.set(v, k);

  // 已知 proto 导出类型名集合（用于校验 lua 里的 reqProto/recvProto 是否真实存在）。
  const protoNames = new Set<string>();
  const protoDir = path.resolve(luaRoot, '..', 'share', 'src', 'proto');
  for (const file of ['messages.ts', 'enums.ts']) {
    const p = path.join(protoDir, file);
    if (!fs.existsSync(p)) continue;
    const text = fs.readFileSync(p, 'utf-8');
    let m: RegExpExecArray | null;
    const pat = /^export\s+(?:interface|enum)\s+([A-Za-z_$][A-Za-z0-9_$]*)/gm;
    while ((m = pat.exec(text)) !== null) protoNames.add(m[1]);
  }

  const netMsgDir = path.join(luaRoot, 'NetMsg');
  const files: string[] = [];
  const walk = (dir: string): void => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (ent.name.startsWith('NetMsg_') && ent.name.endsWith('.lua')) files.push(p);
    }
  };
  walk(netMsgDir);
  files.sort();

  const result: { fileName: string; meta: Meta; luaPath: string }[] = [];
  for (const fp of files) {
    const text = fs.readFileSync(fp, 'utf-8');
    const blocks = parseMetaBlocks(text);
    if (blocks.length === 0) continue;
    const kv = parseKv(blocks[0]);
    const meta = buildMeta(kv, nameToNum, idToName, protoNames);
    result.push({ fileName: path.basename(fp), meta, luaPath: fp });
  }
  return result;
}