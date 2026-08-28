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
  FieldType,
  Label,
  ParsedDescriptor,
  ParsedField,
  loadPackMsg,
} from './parsePackMsg';

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
  const lines = [
    '// 由 mc-local-share generate_ts 自动生成，请勿手改。',
    "export * from './enums';",
    "export * from './messages';",
    "import './fields'; // 副作用：模块加载即登记字段静态表",
    "export * from './fields';",
    '',
  ];
  fs.writeFileSync(indexOutFile, lines.join('\n'), 'utf-8');
}

function genFieldsTs(
  desc: ParsedDescriptor,
  ctx: NameCtx,
  nets: NetJson[],
  msgIdNameToNum: Map<string, number>,
): string {
  // 短名 proto -> 首次出现且合法的 MESSAGE_ID 枚举名（请求优先，其次响应）。
  const idByFlat = new Map<string, string>();
  for (const n of nets) {
    if (n.reqId && n.reqProto) {
      const flat = ctx.shortToFlat.get(n.reqProto);
      if (flat && msgIdNameToNum.has(n.reqId)) idByFlat.set(flat, n.reqId);
    }
    if (n.recId && n.recvProto) {
      const flat = ctx.shortToFlat.get(n.recvProto);
      if (flat && msgIdNameToNum.has(n.recId) && !idByFlat.has(flat)) {
        idByFlat.set(flat, n.recId);
      }
    }
  }

  const lines: string[] = [];
  lines.push('// 由 mc-local-share generate_ts 自动生成，请勿手改。');
  lines.push('// 字段号/种类静态表：模块加载时经 schema.define 登记，供 codec 运行期编解码。');
  lines.push('');
  lines.push("import { FieldType, WireType } from '../common';");
  lines.push("import { define, FieldSchema } from '../schema';");
  lines.push("import { MESSAGE_ID } from '../MESSAGE_ID';");
  lines.push('');

  const seen = new Set<string>();
  for (const m of desc.messages) {
    const flat = ctx.fullToFlat.get(m.fullName)!;
    if (seen.has(flat)) continue;
    seen.add(flat);
    const idName = idByFlat.get(flat);
    const idRef = idName ? `MESSAGE_ID.${idName}` : '0';
    lines.push(`define(${idRef}, '${flat}', ${genFieldArrayDecl(m, ctx)});`);
    lines.push('');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void desc;
  return lines.join('\n');
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

function genHandler(n: NetJson, base: string, ctx: NameCtx, msgIdNameToNum: Map<string, number>): HandlerResult {
  const reqType = n.reqProto ? ctx.shortToFlat.get(n.reqProto) : undefined;
  const resType = n.recvProto ? ctx.shortToFlat.get(n.recvProto) : undefined;
  const reqIdName = msgIdNameToNum.has(n.reqId) ? n.reqId : '';
  const recIdName = msgIdNameToNum.has(n.recId) ? n.recId : '';
  const register = Boolean(n.needParseLua && reqType && resType && reqIdName && recIdName);
  if (!register) return { base, className: base, reqIdName: '', register: false };

  const reqIdNum = msgIdNameToNum.get(reqIdName)!;
  const recIdNum = msgIdNameToNum.get(recIdName)!;
  const tag = n.TageName || base;

  const lines: string[] = [];
  lines.push('// 由 mc-local-share generate_ts 自动生成，请勿手改。');
  lines.push(`// tagName: ${tag}`);
  lines.push('');
  lines.push("import { IHandle } from '../IHandle';");
  lines.push('import {');
  lines.push('  MESSAGE_ID,');
  lines.push(`  ${reqType},`);
  lines.push(`  ${resType},`);
  lines.push("} from 'mc-local-share';");
  lines.push('');
  lines.push('/**');
  lines.push(` * ${tag}`);
  lines.push(` * REQ = ${reqType}`);
  lines.push(` * RES = ${resType}`);
  lines.push(` * 注册：reqId=${reqIdNum}、recId=${recIdNum}`);
  lines.push(' */');
  lines.push(`export class ${base} implements IHandle<${reqType}, ${resType}> {`);
  lines.push(`  /** 请求消息号：${reqIdName} (${reqIdNum}) */`);
  lines.push(`  readonly reqId: MESSAGE_ID = MESSAGE_ID.${reqIdName};`);
  lines.push(`  /** 响应消息号：${recIdName} (${recIdNum}) */`);
  lines.push(`  readonly recId: MESSAGE_ID = MESSAGE_ID.${recIdName};`);
  lines.push('');
  lines.push(`  Handle(req: ${reqType}): ${resType} {`);
  lines.push(`    throw new Error('Handle not implemented: ${tag}');`);
  lines.push('  }');
  lines.push('}');
  return { base, className: base, reqIdName, register: true, content: lines.join('\n') + '\n' };
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

  // ① 生成处理器文件（已存在则跳过，保留手写 Handle）与 Controller 注册数据
  fs.mkdirSync(msgOutDir, { recursive: true });
  const handlers: HandlerResult[] = [];
  let created = 0;
  for (const { base, n } of nets) {
    const h = genHandler(n, base, ctx, msgIdNameToNum);
    handlers.push(h);
    if (h.register && h.content) {
      const file = path.join(msgOutDir, `${h.className}.ts`);
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, h.content, 'utf-8');
        created++;
      }
    }
  }

  // ② 始终重写 MessageController.ts（注册行按类名排序，越界占位由生成函数内联修正）
  fs.mkdirSync(msgOutDir, { recursive: true });
  const controller = genMessageControllerWithIds(handlers, msgIdNameToNum);
  fs.writeFileSync(path.join(msgOutDir, 'MessageController.ts'), controller, 'utf-8');

  // ③ 生成 fields.ts（share/src/proto）
  fs.mkdirSync(path.dirname(fieldsOutFile), { recursive: true });
  const fields = genFieldsTs(desc, ctx, nets.map((x) => x.n), msgIdNameToNum);
  fs.writeFileSync(fieldsOutFile, fields + '\n', 'utf-8');

  // ④ 重写 share/src/proto/index.ts：导出所有 + 导入 fields（触发 define 副作用）
  const indexOutFile = path.join(path.dirname(fieldsOutFile), 'index.ts');
  genProtoIndex(indexOutFile);

  console.log(`[gen-ts] JSON: ${nets.length}，新建处理器: ${created}，注册: ${handlers.filter((h) => h.register).length}`);
  console.log(`[gen-ts] backend 输出: ${msgOutDir}`);
  console.log(`[gen-ts] fields 输出: ${fieldsOutFile}`);
  console.log(`[gen-ts] proto index 重写: ${indexOutFile}`);
}

/** 组装 MessageController：直接以内联 reqId 枚举名注册，避免占位替换。 */
function genMessageControllerWithIds(handlers: HandlerResult[], msgIdNameToNum: Map<string, number>): string {
  const lines: string[] = [];
  lines.push('// 由 mc-local-share generate_ts 自动生成，请勿手改。');
  lines.push('');
  lines.push("import { MessageControllerBase } from '../MessageControllerBase';");
  lines.push("import { MESSAGE_ID } from 'mc-local-share';");
  const sorted = [...handlers].filter((h) => h.register).sort((a, b) => a.className.localeCompare(b.className));
  for (const h of sorted) lines.push(`import { ${h.className} } from './${h.className}';`);
  lines.push('');
  lines.push('export class MessageController extends MessageControllerBase {');
  lines.push('  constructor() {');
  lines.push('    super();');
  for (const h of sorted) {
    lines.push(`    this.AutoResponser[MESSAGE_ID.${h.reqIdName}] = new ${h.className}();`);
  }
  lines.push('  }');
  lines.push('}');
  return lines.join('\n') + '\n';
}

if (require.main === module) {
  main();
}