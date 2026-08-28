/**
 * generate_msg.ts — 解析 pack_msg（FileDescriptorSet）生成「定义接口」。
 * 输出到 share/src/proto：
 *   - enums.ts   —— TS enum
 *   - messages.ts—— message interface
 *
 * 说明：
 *  - 不清空 outDir，也不写入 index.ts（index.ts 由 generate_ts 统一生成，
 *    负责汇总 enums/messages/fields，并让 fields.ts 作为副作用被加载）。
 *  - 只覆写本脚本拥有的 enums.ts / messages.ts，避免误删 generate_ts 的 fields.ts。
 *
 * 用法：
 *   pnpm --filter  mc-local-share gen
 *   npx tsx scripts/generate_msg.ts [packMsgPath] [outDir]
 * 可用环境变量覆盖：PACK_MSG_PATH、GEN_OUT_DIR。
 * 默认 pack_msg = <repo>/backend/protocol/source/pack_msg，输出 = <share>/src/proto。
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

// ---- 输出文件（相对 outDir） ----
const FILE_ENUMS = 'enums.ts';
const FILE_MESSAGES = 'messages.ts';

/** TS 保留字 / 内置类型名，作为属性名时需要引号包裹。 */
const RESERVED = new Set([
  'break','case','catch','class','const','continue','debugger','default','delete','do','else',
  'enum','export','extends','false','finally','for','function','if','import','in','instanceof',
  'new','null','return','super','switch','this','throw','true','try','typeof','var','void','while',
  'with','as','implements','interface','let','package','private','protected','public','static',
  'yield','any','boolean','constructor','declare','get','module','require','number','set','string',
  'symbol','type','from','of','keyof','infer','is','namespace','readonly','unique','abstract',
  'arguments','eval','delete',
]);

/** 校验 / 生成一个合法且唯一的导出名（冲突时追加 _2, _3...）。 */
function uniqueName(base: string, used: Set<string>): string {
  let name = base;
  let n = 2;
  const valid = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name)
    ? name
    : `_${name.replace(/[^A-Za-z0-9_$]/g, '_')}`;
  name = valid;
  while (used.has(name)) {
    name = `${valid}_${n++}`;
  }
  used.add(name);
  return name;
}

/** 属性名：必要时加引号。 */
function propName(name: string): string {
  if (/^[0-9A-Za-z_$]+$/.test(name) && !RESERVED.has(name) && !/^[0-9]/.test(name)) {
    return name;
  }
  return `'${name}'`;
}

/** 标量类型映射。 */
function scalarType(t: FieldType): string {
  switch (t) {
    case FieldType.DOUBLE:
    case FieldType.FLOAT:
      return 'number';
    case FieldType.INT32:
    case FieldType.INT64:
    case FieldType.UINT32:
    case FieldType.UINT64:
    case FieldType.SINT32:
    case FieldType.SINT64:
    case FieldType.FIXED32:
    case FieldType.FIXED64:
    case FieldType.SFIXED32:
    case FieldType.SFIXED64:
      return 'number';
    case FieldType.BOOL:
      return 'boolean';
    case FieldType.STRING:
      return 'string';
    case FieldType.BYTES:
      return 'Uint8Array';
    default:
      return 'unknown';
  }
}

interface GenContext {
  msgByFull: Map<string, string>; // fullName -> 导出名
  enumByFull: Map<string, string>;
  enumNameById: Map<number, string>; // 无 typeName 时按 enum name 短名兜底
}

export function generate(desc: ParsedDescriptor, outDir: string): void {
  // ---- 分配唯一导出名 ----
  const used = new Set<string>();
  const msgByFull = new Map<string, string>();
  const enumByFull = new Map<string, string>();
  const enumByShort = new Map<string, string>();

  for (const e of desc.enums) {
    const name = uniqueName(e.name, used);
    enumByFull.set(e.fullName, name);
    if (!enumByShort.has(e.name)) enumByShort.set(e.name, name);
  }
  for (const m of desc.messages) {
    const name = uniqueName(m.name, used);
    msgByFull.set(m.fullName, name);
  }

  const usedEnums = new Set<string>();
  const ctx: GenContext = { msgByFull, enumByFull, enumNameById: new Map() };

  /** 把字段类型解析成 TS 类型（引用已生成的 message / enum 导出名）。 */
  function fieldType(f: ParsedField): string {
    let base: string;
    if (f.type === FieldType.MESSAGE) {
      base = resolveMessage(f.typeName);
    } else if (f.type === FieldType.ENUM) {
      base = resolveEnum(f.typeName);
    } else {
      base = scalarType(f.type);
    }
    if (f.label === Label.REPEATED) base = `${base}[]`;
    return base;
  }

  function resolveMessage(typeName: string | undefined): string {
    const key = typeName ?? '';
    return msgByFull.get(key) ?? 'unknown';
  }

  function resolveEnum(typeName: string | undefined): string {
    const name = typeName ? enumByFull.get(typeName) ?? enumByShort.get(lastSeg(typeName)) : undefined;
    if (name) {
      usedEnums.add(name);
      return name;
    }
    return 'unknown';
  }

  function lastSeg(name: string): string {
    return name.replace(/^.*\./, '');
  }

  // ---- 生成 enums.ts ----
  const enumLines: string[] = [];
  enumLines.push('// 由 mc-local-share gen 自动生成，请勿手改。');
  enumLines.push('');
  for (const e of desc.enums) {
    const name = enumByFull.get(e.fullName)!;
    enumLines.push(`export enum ${name} {`);
    for (const v of e.values) {
      enumLines.push(`  ${v.name} = ${v.number},`);
    }
    enumLines.push('}');
    enumLines.push('');
  }
  const enumsTs = enumLines.join('\n').replace(/\n+$/, '\n');

  // ---- 生成 messages.ts ----
  // 先渲染消息体以收集 usedEnums，再在其前面拼接注释与 import（避免 import 用空集合）。
  const bodyLines: string[] = [];
  for (const m of desc.messages) {
    const name = msgByFull.get(m.fullName)!;
    bodyLines.push(`export interface ${name} {`);
    for (const f of m.fields) {
      bodyLines.push(`  ${propName(f.name)}${f.label === Label.OPTIONAL ? '?' : ''}: ${fieldType(f)};`);
    }
    bodyLines.push('}');
    bodyLines.push('');
  }
  const msgLines: string[] = [];
  msgLines.push('// 由  mc-local-share gen 自动生成，请勿手改。');
  msgLines.push('');
  if (usedEnums.size > 0) {
    const sorted = Array.from(usedEnums).sort();
    msgLines.push(`import { ${sorted.join(', ')} } from './enums';`);
    msgLines.push('');
  }
  msgLines.push(...bodyLines);
  const messagesTs = msgLines.join('\n').replace(/\n+$/, '\n');

  // ---- 仅覆写本脚本拥有的文件（不整目录清空，避免误删 generate_ts 的 fields.ts）----
  // index.ts 由 generate_ts 统一生成（含 fields 的加载与导出），此处不再写出。
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, FILE_ENUMS), enumsTs, 'utf-8');
  fs.writeFileSync(path.join(outDir, FILE_MESSAGES), messagesTs, 'utf-8');

  // eslint-disable-next-line no-console
  console.log(
    `[gen] messages=${desc.messages.length} enums=${desc.enums.length} enumsUsed=${usedEnums.size}`,
  );
  // eslint-disable-next-line no-console
  console.log(`[gen] 输出目录: ${outDir}`);
}

// 顶层运行时入口（仅在直接执行时触发）
if (require.main === module) {
  const cwd = process.cwd();
  const packPath =
    process.argv[2] || process.env.PACK_MSG_PATH || path.resolve(cwd, '..', 'backend', 'protocol', 'source', 'pack_msg');
  const outDir =
    process.argv[3] || process.env.GEN_OUT_DIR || path.resolve(cwd, 'src/proto');

  if (!fs.existsSync(packPath)) {
    // eslint-disable-next-line no-console
    console.error(`[gen] 找不到 pack_msg: ${packPath}`);
    // eslint-disable-next-line no-console
    console.error('[gen] 可用: node dist/scripts/generate.js <packMsgPath> [outDir]');
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log(`[gen] 解析 pack_msg: ${packPath}`);
  const desc = loadPackMsg(packPath);
  generate(desc, outDir);
}