/**
 * generate_gRPC.ts — 由 pack_msg + LUA 生成「标准可移植 gRPC 工程」及静态 TS。
 *
 * 设计（已确认）：
 *  - 标准 gRPC 工程输出到 proto/ 目录；service 单独成文件，不写进解包出来的 message。
 *  - services.proto：单 service（NineRegionsService）+ 每对一 rpc + Pair 包装（field1=req、field2=res）。
 *  - 在 share 中配置 proto->TS 生成器（本脚本即生成器），生成静态 TS 到 backend/proto。
 *  - backend 作为实际运行的后端客户端，不需要动态加载 proto：直接消费静态 TS 做编解码。
 *
 * 输出分四大块（命名统一由一处派生，避免 .proto 与 TS 名不一致）：
 *  1) proto/proto/message.proto   —— proto2, package Protocol；所有 message/enum（不写 service）。
 *  2) proto/proto/services.proto  —— proto2，import message.proto；Pair 包装 + 单 service 的 rpc。
 *  3) backend/src/proto/message/  —— enums.ts / messages.ts / schema.ts（字段号静态表）。
 *  4) backend/src/proto/service/  —— services.ts（reqId -> { reqType, resType, recId, method } 注册表）。
 *
 * 数据来源：
 *  - pack_msg 是权威 proto 源（消息/枚举字段结构）。
 *  - LUA 提供请求-响应配对（reqId/reqProto/recId/recvProto），与 generate_res 同源。
 *
 * 用法：
 *   node dist/scripts/generate_gRPC.js [LuaDir] [protoOutDir] [tsOutBaseDir]
 *   env 覆盖：LUA_DIR、PROTO_OUT_DIR、RPC_TS_OUT_DIR
 */
import * as fs from 'fs';
import * as path from 'path';
import { FieldType, Label, ParsedDescriptor, ParsedField, loadPackMsg } from './parsePackMsg';
import { collectNetMessages } from './luaMeta';

// ---------------------------------------------------------------------------
// 命名：全路径 → 拍平名（剥掉前导点与包名加下划线），全局唯一
// ---------------------------------------------------------------------------
const PACKAGE = 'Protocol';
const SERVICE_NAME = 'NineRegionsService';

function flatOf(fullName: string): string {
  // ".Protocol.Outer.Inner" -> "Outer_Inner"；".Protocol.EnterGameRequest" -> "EnterGameRequest"
  let n = fullName.replace(/^\./, '');
  if (n.startsWith(PACKAGE + '.')) n = n.slice(PACKAGE.length + 1);
  return n.replace(/\./g, '_');
}

// ---------------------------------------------------------------------------
// 标量类型映射
// ---------------------------------------------------------------------------
function protoScalar(t: FieldType): string | null {
  switch (t) {
    case FieldType.DOUBLE: return 'double';
    case FieldType.FLOAT: return 'float';
    case FieldType.INT64: return 'int64';
    case FieldType.UINT64: return 'uint64';
    case FieldType.INT32: return 'int32';
    case FieldType.FIXED64: return 'fixed64';
    case FieldType.FIXED32: return 'fixed32';
    case FieldType.BOOL: return 'bool';
    case FieldType.STRING: return 'string';
    case FieldType.BYTES: return 'bytes';
    case FieldType.UINT32: return 'uint32';
    case FieldType.SFIXED32: return 'sfixed32';
    case FieldType.SFIXED64: return 'sfixed64';
    case FieldType.SINT32: return 'sint32';
    case FieldType.SINT64: return 'sint64';
    default: return null;
  }
}

function protoLabel(label: Label): string {
  return label === Label.REPEATED ? 'repeated' : label === Label.REQUIRED ? 'required' : 'optional';
}

/** 字段 scoped 类型名（拍平名）。 */
function fieldRef(f: ParsedField, fullToFlat: Map<string, string>): string | null {
  const scalar = protoScalar(f.type);
  if (scalar) return scalar;
  if (f.typeName) return fullToFlat.get(f.typeName) ?? f.typeName;
  return null;
}

/** 字段 wire type 关键字。 */
function wireOf(f: ParsedField): string {
  const scalar = protoScalar(f.type);
  if (f.type === FieldType.BOOL || f.type === FieldType.ENUM || f.type === FieldType.GROUP) {
    return f.type === FieldType.GROUP ? 'LENDELIM' : 'VARINT';
  }
  if (scalar && scalar !== 'string' && scalar !== 'bytes') {
    // 变长整数类：VARINT；定长：FIXED32/FIXED64；float/double 定长。
    switch (scalar) {
      case 'fixed64':
      case 'sfixed64':
      case 'double':
        return 'FIXED64';
      case 'fixed32':
      case 'sfixed32':
      case 'float':
        return 'FIXED32';
      default:
        return 'VARINT';
    }
  }
  return 'LENDELIM'; // string / bytes / message
}

// ---------------------------------------------------------------------------
// .proto 生成
// ---------------------------------------------------------------------------
function genMessagesProto(desc: ParsedDescriptor, fullToFlat: Map<string, string>): string {
  const lines: string[] = [];
  lines.push('// 由 mc-local-share generate_gRPC 自动生成，请勿手改。');
  lines.push('syntax = "proto2";');
  lines.push(`package ${PACKAGE};`);
  lines.push('');

  for (const e of desc.enums) {
    lines.push(`enum ${fullToFlat.get(e.fullName)!} {`);
    for (const v of e.values) lines.push(`  ${v.name} = ${v.number};`);
    lines.push('}');
    lines.push('');
  }

  for (const m of desc.messages) {
    lines.push(`message ${fullToFlat.get(m.fullName)!} {`);
    if (m.fields.length === 0) lines.push('  // 空消息');
    for (const f of m.fields) {
      const ref = fieldRef(f, fullToFlat) ?? 'bytes';
      lines.push(`  ${protoLabel(f.label)} ${ref} ${f.name} = ${f.number};`);
    }
    lines.push('}');
    lines.push('');
  }
  return lines.join('\n');
}

interface GrpcPair {
  /** 方法名（如 EnterGame）。 */
  methodName: string;
  /** Pair 包装消息名（如 EnterGamePair）。 */
  pairName: string;
  /** 请求 message 拍平名。 */
  reqType: string;
  /** 响应 message 拍平名。 */
  resType: string;
  /** 请求消息号枚举表达式（如 MESSAGE_ID.ENTER_GAME_REQ）。 */
  reqIdEnum: string;
  /** 请求消息号数值。 */
  reqId: number;
  /** 响应消息号数值。 */
  recId: number;
  /** 源 NetMsg 类名（如 NetMsg_EnterGame）。 */
  className: string;
  tagName: string;
}

function genServicesProto(pairs: GrpcPair[]): string {
  const lines: string[] = [];
  lines.push('// 由 mc-local-share generate_gRPC 自动生成，请勿手改。');
  lines.push('syntax = "proto2";');
  lines.push(`package ${PACKAGE};`);
  lines.push('import "message.proto";');
  lines.push('');
  lines.push('// 双向请求-响应包装：field1 = request，field2 = response，全工程统一使用。');
  for (const p of pairs) {
    lines.push(`message ${p.pairName} {`);
    lines.push(`  optional ${p.reqType} req = 1;`);
    lines.push(`  optional ${p.resType} res = 2;`);
    lines.push('}');
    lines.push('');
  }
  lines.push(`service ${SERVICE_NAME} {`);
  for (const p of pairs) {
    lines.push(`  rpc ${p.methodName}(${p.pairName}) returns (${p.pairName});`);
  }
  lines.push('}');
  lines.push('');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// TS 生成
// ---------------------------------------------------------------------------
function genEnumsTs(desc: ParsedDescriptor, fullToFlat: Map<string, string>): string {
  const lines: string[] = [];
  lines.push('// 由 mc-local-share generate_gRPC 自动生成，请勿手改。');
  lines.push('');
  for (const e of desc.enums) {
    lines.push(`export enum ${fullToFlat.get(e.fullName)!} {`);
    for (const v of e.values) lines.push(`  ${v.name} = ${v.number},`);
    lines.push('}');
    lines.push('');
  }
  return lines.join('\n');
}

function tsScalar(t: FieldType): string {
  switch (t) {
    case FieldType.DOUBLE:
    case FieldType.FLOAT:
    case FieldType.INT64:
    case FieldType.UINT64:
    case FieldType.INT32:
    case FieldType.UINT32:
    case FieldType.SINT32:
    case FieldType.SINT64:
    case FieldType.FIXED32:
    case FieldType.FIXED64:
    case FieldType.SFIXED32:
    case FieldType.SFIXED64:
      return 'number';
    case FieldType.BOOL: return 'boolean';
    case FieldType.STRING: return 'string';
    case FieldType.BYTES: return 'Uint8Array';
    default: return 'unknown';
  }
}

function genMessagesTs(desc: ParsedDescriptor, fullToFlat: Map<string, string>): string {
  const lines: string[] = [];
  lines.push('// 由 mc-local-share generate_gRPC 自动生成，请勿手改。');
  lines.push('');

  // 先收集字段用到的 enum 拍平名，作为 import。
  const usedEnums = new Set<string>();
  const enumFlat = new Set<string>();
  for (const e of desc.enums) enumFlat.add(fullToFlat.get(e.fullName)!);
  for (const m of desc.messages) {
    for (const f of m.fields) {
      if (f.type === FieldType.ENUM && f.typeName) {
        const flat = fullToFlat.get(f.typeName);
        if (flat && enumFlat.has(flat)) usedEnums.add(flat);
      }
    }
  }
  if (usedEnums.size > 0) {
    lines.push(`import { ${Array.from(usedEnums).sort().join(', ')} } from './enums';`);
    lines.push('');
  }

  for (const m of desc.messages) {
    const name = fullToFlat.get(m.fullName)!;
    lines.push(`export interface ${name} {`);
    if (m.fields.length === 0) lines.push('  // 空消息');
    for (const f of m.fields) {
      let t: string;
      if (f.type === FieldType.MESSAGE || f.type === FieldType.ENUM) {
        t = fullToFlat.get(f.typeName!) ?? 'unknown';
      } else {
        t = tsScalar(f.type);
      }
      if (f.label === Label.REPEATED) t = `${t}[]`;
      lines.push(`  ${f.name}${f.label === Label.OPTIONAL ? '?' : ''}: ${t};`);
    }
    lines.push('}');
    lines.push('');
  }
  return lines.join('\n');
}

function genSchemaTs(desc: ParsedDescriptor, fullToFlat: Map<string, string>): string {
  const lines: string[] = [];
  lines.push('// 由 mc-local-share generate_gRPC 自动生成，请勿手改。');
  lines.push('// 字段号/类型静态表：运行期编解码不依赖动态 proto。');
  lines.push('');
  lines.push('export enum WireType { VARINT = 0, FIXED64 = 1, LENDELIM = 2, FIXED32 = 5 }');
  lines.push('');
  lines.push('export type ScalarKind =');
  lines.push('  | "double" | "float" | "int64" | "uint64" | "int32" | "uint32" | "sint32" | "sint64"');
  lines.push('  | "fixed32" | "fixed64" | "sfixed32" | "sfixed64" | "bool" | "string" | "bytes";');
  lines.push('');
  lines.push('export interface FieldSchema {');
  lines.push('  /** 字段名（供以 name 为 key 的对象访问）。 */');
  lines.push('  name: string;');
  lines.push('  /** 字段号（protobuf 线格式）。 */');
  lines.push('  number: number;');
  lines.push('  kind: ScalarKind | "message" | "enum";');
  lines.push('  repeated: boolean;');
  lines.push('  /** message/enum 的拍平类型名。 */');
  lines.push('  typeName?: string;');
  lines.push('  wire: WireType;');
  lines.push('}');
  lines.push('');
  lines.push('export interface MessageSchema {');
  lines.push('  name: string;');
  lines.push('  /** 按字段号升序。 */');
  lines.push('  fields: FieldSchema[];');
  lines.push('  byNumber: Record<number, FieldSchema>;');
  lines.push('  byName: Record<string, FieldSchema>;');
  lines.push('}');
  lines.push('');
  lines.push('const REG: Record<string, MessageSchema> = {};');
  lines.push('');
  lines.push('function define(name: string, fields: FieldSchema[]): MessageSchema {');
  lines.push(`  const sorted = [...fields].sort((a, b) => a.number - b.number);`);
  lines.push(`  const byNumber: Record<number, FieldSchema> = {};`);
  lines.push(`  const byName: Record<string, FieldSchema> = {};`);
  lines.push(`  for (const f of sorted) { byNumber[f.number] = f; byName[f.name] = f; }`);
  lines.push(`  const s: MessageSchema = { name, fields: sorted, byNumber, byName };`);
  lines.push(`  REG[name] = s;`);
  lines.push(`  return s;`);
  lines.push('}');
  lines.push('');
  lines.push('export function get(name: string): MessageSchema | undefined { return REG[name]; }');
  lines.push('');
  lines.push('export const schemaByName: Readonly<Record<string, MessageSchema>> = REG;');
  lines.push('');

  for (const m of desc.messages) {
    const name = fullToFlat.get(m.fullName)!;
    lines.push(`define(${JSON.stringify(name)}, [`);
    for (const f of m.fields) {
      const scalar = protoScalar(f.type);
      const kind = scalar ? JSON.stringify(scalar) : `"${f.type === FieldType.ENUM ? 'enum' : 'message'}"`;
      const typeName = (f.type === FieldType.MESSAGE || f.type === FieldType.ENUM) && f.typeName
        ? JSON.stringify(fullToFlat.get(f.typeName) ?? f.typeName)
        : 'undefined';
      lines.push(`  { name: ${JSON.stringify(f.name)}, number: ${f.number}, kind: ${kind}, repeated: ${f.label === Label.REPEATED}, typeName: ${typeName}, wire: WireType.${wireOf(f)} },`);
    }
    lines.push(']);');
    lines.push('');
  }
  return lines.join('\n');
}

function genServicesTs(pairs: GrpcPair[]): string {
  const lines: string[] = [];
  lines.push('// 由 mc-local-share generate_gRPC 自动生成，请勿手改。');
  lines.push('// RPC 注册表：供无动态 proto 的运行时使用。同一逻辑操作可能被拆分到 _CN/_Req 与 _SN/_Rep');
  lines.push('// 两个文件，故每个 NetMsg 文件各生成一个 rpc（缺失一侧以 Empty 补齐，reqId/recId 可为 -1）。');
  // services.ts 与 schema/codec 一同隶属 mc-local-share 共享层，from share/src/proto 相对引用 MESSAGE_ID。
  lines.push("import { MESSAGE_ID } from '../MESSAGE_ID';");
  lines.push('');
  lines.push('export interface RpcEntry {');
  lines.push('  /** 请求消息号（MESSAGE_ID 枚举；单边补齐时为 -1）。 */');
  lines.push('  reqId: MESSAGE_ID;');
  lines.push('  /** 请求 message 拍平名（对应 message/messages.ts；补齐为 Empty）。 */');
  lines.push('  reqType: string;');
  lines.push('  /** 响应 message 拍平名。 */');
  lines.push('  resType: string;');
  lines.push('  /** 响应消息号（MESSAGE_ID 枚举；单边补齐时为 -1）。 */');
  lines.push('  recId: MESSAGE_ID;');
  lines.push('  /** gRPC 方法名（对应 services.proto rpc）。 */');
  lines.push('  method: string;');
  lines.push('  /** Pair 包装消息名。 */');
  lines.push('  pairName: string;');
  lines.push('  /** 源 NetMsg 类名。 */');
  lines.push('  className: string;');
  lines.push('  tagName: string;');
  lines.push('}');
  lines.push('');
  lines.push('function entry(p: Omit<RpcEntry, \'reqId\' | \'recId\'>, reqId: number, recId: number): RpcEntry {');
  lines.push('  return { ...p, reqId: reqId as MESSAGE_ID, recId: recId as MESSAGE_ID };');
  lines.push('}');
  lines.push('');
  lines.push('export const RPC_BY_METHOD: Record<string, RpcEntry> = {');
  for (const p of pairs) {
    lines.push(`  ${JSON.stringify(p.methodName)}: entry({`);
    lines.push(`    reqType: ${JSON.stringify(p.reqType)},`);
    lines.push(`    resType: ${JSON.stringify(p.resType)},`);
    lines.push(`    method: ${JSON.stringify(p.methodName)},`);
    lines.push(`    pairName: ${JSON.stringify(p.pairName)},`);
    lines.push(`    className: ${JSON.stringify(p.className)},`);
    lines.push(`    tagName: ${JSON.stringify(p.tagName)},`);
    lines.push(`  }, ${p.reqId}, ${p.recId}),`);
  }
  lines.push('};');
  lines.push('');
  lines.push('// 仅对含合法请求消息号的配对建立 reqId 索引（用于按消息号查找完整双向 rpc）。');
  lines.push('// 源数据存在消息号复用的历史（如 10204/10260/10200 出现在多个文件），按第一个出现者登记。');
  lines.push('export const RPC_BY_REQID: Record<number, RpcEntry> = {');
  const seenReqIds = new Set<number>();
  for (const p of pairs) {
    if (p.reqId > 0 && !seenReqIds.has(p.reqId)) {
      seenReqIds.add(p.reqId);
      lines.push(`  [${p.reqId}]: RPC_BY_METHOD[${JSON.stringify(p.methodName)}]!,`);
    }
  }
  lines.push('};');
  lines.push('');
  lines.push('export const SERVICE_NAME = ' + JSON.stringify(SERVICE_NAME) + ';');
  lines.push('');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// 入口
// ---------------------------------------------------------------------------
function methodNameOf(className: string): string {
  const base = className.startsWith('NetMsg_') ? className.slice('NetMsg_'.length) : className;
  // 确保是合法 TS 标识符（类名均为字母开头，理论上安全，仅兜底替换非法字符）。
  return base.replace(/[^A-Za-z0-9_$]/g, '_');
}

function buildPairs(
  luaDir: string,
  fullToFlat: Map<string, string>,
  emptyName: string,
): GrpcPair[] {
  const flatMessageNames = new Set<string>();
  for (const v of fullToFlat.values()) flatMessageNames.add(v);

  const nets = collectNetMessages(luaDir);
  const pairs: GrpcPair[] = [];
  const usedMethods = new Set<string>();

  for (const { fileName, meta } of nets) {
    const className = fileName.replace(/\.lua$/, '');
    // 请求/响应类型：声明则用其拍平名，缺失则以 Empty 补齐；两侧皆缺则无法成 rpc，跳过。
    const reqType = meta.reqProto && flatMessageNames.has(meta.reqProto) ? meta.reqProto : emptyName;
    const resType = meta.recvProto && flatMessageNames.has(meta.recvProto) ? meta.recvProto : emptyName;
    if (reqType === emptyName && resType === emptyName) continue;

    const methodName = uniqueMethod(className, usedMethods);

    const reqId = meta.reqId.num > 0 ? meta.reqId.num : -1;
    const recId = meta.recId.num > 0 ? meta.recId.num : -1;

    pairs.push({
      methodName,
      pairName: `${methodName}Pair`,
      reqType,
      resType,
      reqIdEnum: meta.reqId.enumExpr,
      reqId,
      recId,
      className,
      tagName: meta.tagName,
    });
  }

  pairs.sort((a, b) => a.methodName.localeCompare(b.methodName));
  return pairs;
}

function uniqueMethod(className: string, used: Set<string>): string {
  const base = methodNameOf(className);
  let name = base;
  let i = 2;
  while (used.has(name)) name = `${base}_${i++}`;
  used.add(name);
  return name;
}

function main(): void {
  const cwd = process.cwd();
  const root = path.resolve(cwd, '..');
  const luaDir = path.resolve(process.argv[2] || process.env.LUA_DIR || path.join(root, 'LUA'));
  const protoOut = path.resolve(process.argv[3] || process.env.PROTO_OUT_DIR || path.resolve(root, 'proto'));
  // 静态 TS（enums/messages/services/schema）全部归属 mc-local-share 共享层，
  // backend 只从 'mc-local-share' 导入，不在 backend 内维护本地 proto 副本。
  const shareSrcOut = path.resolve(process.env.SHARE_SRC_OUT_DIR || path.resolve(root, 'share', 'src', 'proto'));

  const packPath = process.env.PACK_MSG_PATH || path.resolve(root, 'backend', 'protocol', 'source', 'pack_msg');
  const desc = loadPackMsg(packPath);

  // 追加合成空消息 Empty：用于「全量含单边补齐」时给缺失的一侧做占位。
  desc.messages.push({ fullName: '.Protocol.Empty', name: 'Empty', fields: [], fieldOrder: [] });

  // 统一命名映射
  const fullToFlat = new Map<string, string>();
  const used = new Set<string>();
  const claim = (fullName: string): string => {
    const base = flatOf(fullName);
    let n = base;
    let i = 2;
    while (used.has(n)) n = `${base}_${i++}`;
    used.add(n);
    fullToFlat.set(fullName, n);
    return n;
  };
  for (const e of desc.enums) claim(e.fullName);
  for (const m of desc.messages) claim(m.fullName);

  const emptyName = fullToFlat.get('.Protocol.Empty')!;
  const pairs = buildPairs(luaDir, fullToFlat, emptyName);

  // 1) 标准 gRPC 工程 (proto/)
  const protoDir = path.join(protoOut, 'proto');
  fs.mkdirSync(protoDir, { recursive: true });
  fs.writeFileSync(path.join(protoDir, 'message.proto'), genMessagesProto(desc, fullToFlat), 'utf-8');
  fs.writeFileSync(path.join(protoDir, 'services.proto'), genServicesProto(pairs), 'utf-8');

  // 2) 静态 TS：enums/messages/services/schema 全部落在 share/src/proto（mc-local-share 共享层）。
  //    backend 通过 pnpm workspace 从 'mc-local-share' 导入，不维护本地 proto 副本。
  fs.mkdirSync(shareSrcOut, { recursive: true });
  fs.writeFileSync(path.join(shareSrcOut, 'enums.ts'), genEnumsTs(desc, fullToFlat), 'utf-8');
  fs.writeFileSync(path.join(shareSrcOut, 'messages.ts'), genMessagesTs(desc, fullToFlat), 'utf-8');
  fs.writeFileSync(path.join(shareSrcOut, 'services.ts'), genServicesTs(pairs), 'utf-8');
  fs.writeFileSync(path.join(shareSrcOut, 'schema.ts'), genSchemaTs(desc, fullToFlat), 'utf-8');

  console.log(`[gen-grpc] messages=${desc.messages.length} enums=${desc.enums.length}`);
  console.log(`[gen-grpc] rpc pairs=${pairs.length}`);
  console.log(`[gen-grpc] proto dir: ${protoDir}`);
  console.log(`[gen-grpc] share ts dir: ${shareSrcOut}`);
}

if (require.main === module) main();