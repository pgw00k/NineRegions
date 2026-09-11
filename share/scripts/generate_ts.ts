/**
 * generate_ts.ts — 依据 share/msg（与 share/msg_ex）下的 JSON 元数据生成两类 TS：
 *  1) backend/src/net/msg/*.ts —— 处理器骨架（迁移自 generate_res）+ MessageController.ts。
 *      - 生成时「不覆写已存在」的处理器文件，避免冲掉手写的 Handle 实现；
 *      - MessageController.ts 始终重写，保证注册完整。
 *  2) share/src/proto/fields.ts —— 通过 schema.define 登记「字段号/种类/线格式」静态表，
 *      请求/响应消息同时按 MESSAGE_ID 登记，供 codec 在运行期编解码。
 *
 * 数据来源（命令行/环境变量可覆盖）：
 *  - JSON 目录数组：默认 [ <repo>/share/msg, <repo>/share/msg_ex ]，遍历其下所有 .json；
 *  - pack_msg：解析得到全部 message/enum 的字段结构（与 generate_msg 同一份 ParsedDescriptor）；
 *  - MESSAGE_ID.ts：把 reqId/recId 的枚举名解析成数值，用于注释里的可读数字。
 *
 * JSON 字段（由 generate_res 产生）：
 *   TageName / reqId / reqProto / recId / recvProto / needParseLua
 *
 * 用法：
 *   npx tsx scripts/generate_ts.ts
 *   env 覆盖：TS_JSON_DIRS(以 : 分隔)、TS_MSG_OUT_DIR、TS_SHARE_OUT_DIR、TS_PACK_MSG、TS_MESSAGE_ID
 */
import * as fs from 'fs';
import * as path from 'path';
import {
  Label,
  ParsedDescriptor,
  ParsedField,
  loadPackMsg,
} from './parsePackMsg';

import { FieldType } from '../src/common';

/** 消息配对 JSON 的结构（与 generate_res 输出对齐）。 */
interface NetJson {
  TageName?: string;
  reqId: string;
  reqProto: string;
  recId: string;
  recvProto: string;
  needParseLua?: boolean;
}

// ---------------------------------------------------------------------------
// 拍平命名：与 generate_msg 完全一致（shortName + 冲突补 _N），保证映射名 == messages.ts 导出名
// ---------------------------------------------------------------------------
function uniqueName(base: string, used: Set<string>): string {
  const valid = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(base) ? base : `_${base.replace(/[^A-Za-z0-9_$]/g, '_')}`;
  let name = valid;
  let n = 2;
  while (used.has(name)) name = `${valid}_${n++}`;
  used.add(name);
  return name;
}

interface NameCtx {
  fullToFlat: Map<string, string>;
  /** shortName(唯一) -> 导出名；用于把 LUA 里的 reqProto/recvProto 短名解析成导出名。 */
  shortToFlat: Map<string, string>;
}

function buildNames(desc: ParsedDescriptor): NameCtx {
  const used = new Set<string>();
  const fullToFlat = new Map<string, string>();
  const shortToFlat = new Map<string, string>();
  const claim = (full: string, short: string): string => {
    const flat = uniqueName(short, used);
    fullToFlat.set(full, flat);
    if (!shortToFlat.has(short)) shortToFlat.set(short, flat);
    return flat;
  };
  for (const e of desc.enums) claim(e.fullName, e.name);
  for (const m of desc.messages) claim(m.fullName, m.name);
  return { fullToFlat, shortToFlat };
}

// ---------------------------------------------------------------------------
// 字段 → WireType
// ---------------------------------------------------------------------------
function wireOf(t: FieldType): string {
  if (
    t === FieldType.MESSAGE ||
    t === FieldType.STRING ||
    t === FieldType.BYTES ||
    t === FieldType.GROUP
  ) {
    return 'WireType.LENDELIM';
  }
  if (t === FieldType.FLOAT || t === FieldType.FIXED32 || t === FieldType.SFIXED32) {
    return 'WireType.FIXED32';
  }
  if (t === FieldType.DOUBLE || t === FieldType.FIXED64 || t === FieldType.SFIXED64) {
    return 'WireType.FIXED64';
  }
  return 'WireType.VARINT'; // 其余整型 / bool / enum
}

function fieldLine(f: ParsedField, ctx: NameCtx): string {
  // 仅 message 与 enum 需要 typeName（拍平导出名）；纯标量无需。
  const typeName =
    (f.type === FieldType.MESSAGE || f.type === FieldType.ENUM) && f.typeName
      ? (ctx.fullToFlat.get(f.typeName) ?? f.typeName)
      : undefined;
  const typeNamePart = typeName ? `, typeName: '${typeName}'` : '';
  const repeated = f.label === Label.REPEATED;
  return `    { name: '${f.name}', number: ${f.number}, kind: FieldType.${FieldType[f.type]}, repeated: ${repeated}${typeNamePart}, wire: ${wireOf(f.type)} },`;
}

// ---------------------------------------------------------------------------
// fields.ts：通过 schema.define 登记全部消息；请求/响应额外按 MESSAGE_ID 登记
// ---------------------------------------------------------------------------
/** 重写 share/src/proto/index.ts：导出定义 + 副作用导入 fields（触发字段登记）。 */
function genProtoIndex(indexOutFile: string): void {
  // const lines = [
  //   '// 由 mc-local-share generate_ts 自动生成，请勿手改。',
  //   "export * from './enums';",
  //   "export * from './messages';",
  //   "import './fields'; // 副作用：模块加载即登记字段静态表",
  //   "export * from './fields';",
  //   '',
  // ];
  // fs.writeFileSync(indexOutFile, lines.join('\n'), 'utf-8');
}

function genFieldsTs(
  desc: ParsedDescriptor,
  ctx: NameCtx,
  nets: NetJson[],
  msgIdNameToNum: Map<string, number>,
  scriptDir: string,
): string {
  const defineLines: string[] = [];
  const idMappingLines: string[] = [];
  const seen = new Set<string>();
  const idSet = new Set<number>();

  // ① 收集所有需要 define 的消息名：
  //     a) 出现在网段（recvProto/reqProto）中的消息；
  //     b) 任一消息字段 typeName 引用到的嵌套消息（含多级），保证嵌套解析可用。
  const targets = new Set<string>();
  for (const n of nets) {
    for (const p of [n.reqProto, n.recvProto]) {
      const flat = p && ctx.shortToFlat.get(p);
      if (flat) targets.add(flat);
    }
  }
  let grew = true;
  while (grew) {
    grew = false;
    for (const m of desc.messages) {
      const flat = ctx.fullToFlat.get(m.fullName);
      if (!flat || !targets.has(flat)) continue;
      for (const f of m.fields) {
        if (f.type !== FieldType.MESSAGE || !f.typeName) continue;
        const nested = ctx.fullToFlat.get(f.typeName) ?? ctx.shortToFlat.get(f.typeName);
        if (nested && !targets.has(nested)) {
          targets.add(nested);
          grew = true;
        }
      }
    }
  }

  // ② 生成 define 行：每个拍平名只登记一次（同 recvProto 被多个 MESSAGE_ID 共用也不重复）。
  const byFlat = new Map<string, ParsedDescriptor['messages'][number]>();
  for (const m of desc.messages) {
    const flat = ctx.fullToFlat.get(m.fullName);
    if (flat) byFlat.set(flat, m);
  }
  for (const flat of targets) {
    const msg = byFlat.get(flat);
    if (!msg || seen.has(flat)) continue;
    seen.add(flat);
    defineLines.push(`define('${flat}', ${genFieldArrayDecl(msg, ctx)});`);
  }

  // ③ 生成 MESSAGE_ID → 拍平名 映射行（id 合法才登记）。
  //    请求（reqId/reqProto）与响应（recId/recvProto）都登记，保证 codec 编码请求、解码响应都能查到 schema。
  //    注意：部分协议 reqId 与 recId 数值相同（MESSAGE_ID 中 REQ/REP 同号），此时按数值去重无法两全，
  //    优先登记响应侧（rec），因为解码是 codec 主流程，且 push 类消息只有 rec 侧。
  const mapIdProto = (idName: string, proto: string): void => {
    const idNum = idName && msgIdNameToNum.has(idName) ? msgIdNameToNum.get(idName)! : null;
    if (!idNum || !proto) return;
    const flat = ctx.shortToFlat.get(proto);
    if (!flat) return;
    if (!idSet.has(idNum)) {
      idSet.add(idNum);
      idMappingLines.push(`ID_BY_NAME[MESSAGE_ID.${idName}] = '${flat}';`);
    }
  };
  for (const n of nets) {
    mapIdProto(n.recId, n.recvProto);
    mapIdProto(n.reqId, n.reqProto);
  }

  return renderEjs(loadFieldsTemplate(scriptDir), {
    defines: defineLines,
    idMappings: idMappingLines,
  }).trimEnd();
}

/** 生成 FieldSchema[] 的元素数组文本（内联），供 define 使用。 */
function genFieldArrayDecl(m: { fields: ParsedField[] }, ctx: NameCtx): string {
  const rows = m.fields.map((f) => fieldLine(f, ctx));
  if (rows.length === 0) return '[]';
  return `[\n${rows.join('\n')}\n  ]`;
}

// ---------------------------------------------------------------------------
// backend handler：NetMsg_*.ts（存在即跳过） + MessageController.ts（始终重写）
// ---------------------------------------------------------------------------
interface HandlerResult {
  /** 处理器类导出的扁平名片段（不含 NetMsg_ 前缀，即 JSON 文件名 base）。 */
  base: string;
  /** 处理器类名，等于 base（文件 base 已是合法 TS 标识符）。 */
  className: string;
  /** 注册用的请求消息号 MESSAGE_ID 枚举名（MESSAGE_ID 中存在的才有效）。 */
  reqIdName: string;
  /** 是否应在 MessageController 中注册（needParseLua 且 req/rec 均可用）。 */
  register: boolean;
  /** 若需新建文件时的文件内容。 */
  content?: string;
}

/** 缓存模板内容，避免每次生成重复读盘。 */
let cachedHandlerTemplate: string | null = null;

/**
 * 读取处理器模板文件（share/scripts/templates/NetMsg.ejs），
 * 便于直接编辑模板来调整生成内容，而无需改动本脚本。
 */
function loadHandlerTemplate(scriptDir: string): string {
  if (cachedHandlerTemplate === null) {
    const tpl = path.join(scriptDir, 'templates', 'NetMsg.ejs');
    cachedHandlerTemplate = fs.readFileSync(tpl, 'utf-8');
  }
  return cachedHandlerTemplate;
}

/**
 * 轻量 EJS 兼容渲染器：支持 `<% ... %>`（JS 逻辑，如 if/for）与 `<%- ... %>`（看原始输出）。
 * data 里的字段在模板中按名字直接引用；渲染发生在收集用的 function 作用域内。
 * 说明：生成的是 TS 源码而非 HTML，因此 `<%= %>` / `<%- %>` 均不做 HTML 转义。
 */
function renderEjs(tpl: string, data: Record<string, unknown>): string {
  const body: string[] = [];
  const tagRe = /<%([=!-])?\s*([\s\S]*?)\s*%>/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(tpl)) !== null) {
    const text = tpl.slice(last, m.index);
    if (text) body.push(`__o.push(${JSON.stringify(text)});`);
    if (m[1] === undefined) {
      body.push(m[2]); // scriptlet：原样作为 JS 语句
    } else {
      body.push(`__o.push(String(${m[2]}));`); // 输出表达式的值
    }
    last = m.index + m[0].length;
  }
  if (last < tpl.length) body.push(`__o.push(${JSON.stringify(tpl.slice(last))});`);
  const src = `var __o=[];\nwith(data||{}){\n${body.join('\n')}\n}\nreturn __o.join('');`;
  const fn = new Function('data', src) as (d: unknown) => string;
  return fn(data);
}

function genHandler(
  n: NetJson,
  base: string,
  ctx: NameCtx,
  msgIdNameToNum: Map<string, number>,
  scriptDir: string,
): HandlerResult {
  const reqType = n.reqProto ? ctx.shortToFlat.get(n.reqProto) : "{}";
  const resType = n.recvProto ? ctx.shortToFlat.get(n.recvProto) : "{}";
  const reqIdName = msgIdNameToNum.has(n.reqId) ? n.reqId : 'NETWORK_MESSAGE_BEGIN';
  const recIdName = msgIdNameToNum.has(n.recId) ? n.recId : 'NETWORK_MESSAGE_BEGIN';
  const register = Boolean(n.reqProto && n.recvProto);
  
  if (!register) {
    // console.log(`${base} not registered, n.reqProto=${n.reqProto}, n.recvProto=${n.recvProto}`);
    // return { base, className: base, reqIdName: '', register: false };
  }

  const reqIdNum = msgIdNameToNum.get(reqIdName)!;
  const recIdNum = msgIdNameToNum.get(recIdName)!;
  const tag = n.TageName || base;

  const content = renderEjs(loadHandlerTemplate(scriptDir), {
    TAG: tag,
    REQ_TYPE: reqType!,
    RES_TYPE: resType!,
    REQ_ID_NAME: reqIdName,
    REC_ID_NAME: recIdName,
    REQ_ID_NUM: String(reqIdNum),
    REC_ID_NUM: String(recIdNum),
    CLASS_NAME: base,
  });
  return { base, className: base, reqIdName, register, content: content.endsWith('\n') ? content : content + '\n' };
}

// ---------------------------------------------------------------------------
// 解析 MESSAGE_ID 枚举名 -> 数值
// ---------------------------------------------------------------------------
function parseMessageIdEnum(file: string): Map<string, number> {
  const map = new Map<string, number>();
  if (!fs.existsSync(file)) return map;
  const text = fs.readFileSync(file, 'utf-8');
  const re = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(-?\d+)\s*,/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) map.set(m[1], Number(m[2]));
  return map;
}

// ---------------------------------------------------------------------------
// 入口
// ---------------------------------------------------------------------------
function main(): void {
  const cwd = process.cwd();
  const root = path.resolve(cwd, '..');

  const defaultJsonDirs = [path.join(root, 'share', 'msg'), path.join(root, 'share', 'msg_ex')].join(path.delimiter);
  const jsonDirs = (process.env.TS_JSON_DIRS || defaultJsonDirs)
    .split(path.delimiter)
    .filter(Boolean)
    .map((d) => path.resolve(d));
  const msgOutDir = path.resolve(process.env.TS_MSG_OUT_DIR || path.join(root, 'backend', 'src', 'net', 'msg'));
  const fieldsOutFile = path.resolve(
    process.env.TS_SHARE_OUT_DIR || path.join(root, 'share', 'src', 'proto', 'fields.ts'),
  );
  const packPath = path.resolve(
    process.env.TS_PACK_MSG || path.join(root, 'backend', 'protocol', 'source', 'pack_msg'),
  );
  const messageIdFile = path.resolve(process.env.TS_MESSAGE_ID || path.join(root, 'share', 'src', 'MESSAGE_ID.ts'));

  // 收集 JSON
  const nets: { base: string; n: NetJson }[] = [];
  for (const dir of jsonDirs) {
    if (!fs.existsSync(dir)) {
      console.warn(`[gen-ts] 跳过不存在的 JSON 目录: ${dir}`);
      continue;
    }
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!ent.isFile() || !ent.name.endsWith('.json')) continue;
      const base = ent.name.replace(/\.json$/, '');
      const n = JSON.parse(fs.readFileSync(path.join(dir, ent.name), 'utf-8')) as NetJson;
      nets.push({ base, n });
    }
  }

  // 数据来源
  if (!fs.existsSync(packPath)) {
    console.error(`[gen-ts] 找不到 pack_msg: ${packPath}`);
    process.exit(1);
  }
  const desc = loadPackMsg(packPath);
  const ctx = buildNames(desc);
  const msgIdNameToNum = parseMessageIdEnum(messageIdFile);
  const forceReplace = true;

  // ① 生成处理器文件
  fs.mkdirSync(msgOutDir, { recursive: true });
  const handlers: HandlerResult[] = [];
  let created = 0;
  const scriptDir = __dirname;
  for (const { base, n } of nets) {
    const h = genHandler(n, base, ctx, msgIdNameToNum, scriptDir);
    handlers.push(h);
    // 有模板的都写入
    if (h.content) {
      const file = path.join(msgOutDir, `${h.className}.ts`);
      if (!fs.existsSync(file) || forceReplace) {
        fs.writeFileSync(file, h.content, 'utf-8');
        created++;
      }
    }
  }

  // ② 始终重写 MessageController.ts（注册行按类名排序，越界占位由生成函数内联修正）
  fs.mkdirSync(msgOutDir, { recursive: true });
  const controller = genMessageControllerWithIds(handlers, msgIdNameToNum, scriptDir);
  fs.writeFileSync(path.join(msgOutDir, 'MessageController.ts'), controller, 'utf-8');

  // ③ 生成 fields.ts（share/src/proto）
  fs.mkdirSync(path.dirname(fieldsOutFile), { recursive: true });
  const fields = genFieldsTs(desc, ctx, nets.map((x) => x.n), msgIdNameToNum, scriptDir);
  fs.writeFileSync(fieldsOutFile, fields + '\n', 'utf-8');

  // ④ 重写 share/src/proto/index.ts：导出所有 + 导入 fields（触发 define 副作用）
  const indexOutFile = path.join(path.dirname(fieldsOutFile), 'index.ts');
  genProtoIndex(indexOutFile);

  console.log(`[gen-ts] JSON: ${nets.length}，新建处理器: ${created}，注册: ${handlers.filter((h) => h.register).length}`);
  console.log(`[gen-ts] backend 输出: ${msgOutDir}`);
  console.log(`[gen-ts] fields 输出: ${fieldsOutFile}`);
  console.log(`[gen-ts] proto index 重写: ${indexOutFile}`);
}

/** 缓存 fields 模板内容，避免每次生成重复读盘。 */
let cachedFieldsTemplate: string | null = null;

/**
 * 读取 fields 模板文件（share/scripts/templates/Fields.ejs）。
 * 模板内嵌 `<% defines.forEach %>` 循环占位符，由 genFieldsTs 生成 define 行后替换。
 */
function loadFieldsTemplate(scriptDir: string): string {
  if (cachedFieldsTemplate === null) {
    const tpl = path.join(scriptDir, 'templates', 'Fields.ejs');
    cachedFieldsTemplate = fs.readFileSync(tpl, 'utf-8');
  }
  return cachedFieldsTemplate;
}

/** 缓存控制器模板内容，避免每次生成重复读盘。 */
let cachedControllerTemplate: string | null = null;

/**
 * 读取控制器模板文件（share/scripts/templates/MessageController.ejs）。
 * 模板内嵌 `<% imports.forEach %>` / `<% registers.forEach %>` 两个 EJS 循环，
 * 由 genMessageControllerWithIds 注入 imports / registers 数组。
 */
function loadControllerTemplate(scriptDir: string): string {
  if (cachedControllerTemplate === null) {
    const tpl = path.join(scriptDir, 'templates', 'MessageController.ejs');
    cachedControllerTemplate = fs.readFileSync(tpl, 'utf-8');
  }
  return cachedControllerTemplate;
}

/** 组装 MessageController：直接以内联 reqId 枚举名注册，避免占位替换。 */
function genMessageControllerWithIds(
  handlers: HandlerResult[],
  msgIdNameToNum: Map<string, number>,
  scriptDir: string,
): string {
  const sorted = [...handlers].filter((h) => h.register).sort((a, b) => a.className.localeCompare(b.className));
  return renderEjs(loadControllerTemplate(scriptDir), {
    // 模板里的 for 循环会遍历这两个数组来生成 import 与注册行。
    imports: sorted.map((h) => ({ name: h.className })),
    registers: sorted.map((h) => ({ name: h.className, idName: h.reqIdName })),
  }) + '\n';
}

if (require.main === module) {
  main();
}