/**
 * ProtoTools.ts — C2S 请求 protobuf 解码工具（与 ProtobufEncoder 对称）。
 *
 * 把客户端发来的裸 protobuf body 按 schema 解码成「字段号 keyed」对象：
 *   { 1: 10001, 2: "name", 3: { 1: 5, 2: 6 }, 6: [1,2,3] }
 * 供各 Handler 直接读取请求参数（保持与 mock/编码一致的字段号约定）。
 *
 * 解码规则：
 *  - wire0 varint      → number
 *  - wire2 length      → 若字段是 MESSAGE 递归解码为对象；否则按 STRING 解 UTF-8
 *                        （BYTES 保留 Buffer）
 *  - repeated 字段     → 数组（重复出现时 push）
 *  - 未知字段号       → 跳过（客户端可能发 schema 外字段）
 *  - 嵌套 message 的 type_name 无法解析时回退为原始字节 Buffer
 */
import { Buffer } from 'buffer';
import {
  FieldType,
  Label,
  readRawFields,
  decodeVarint,
  RawField,
} from '../proto/ProtobufCodec';
import { SchemaRegistry, MessageSchema } from '../proto/SchemaRegistry';

/** 递归解码一条消息的字段。自动剥离 NetBitStream 前缀（实测 C2S body 模式）。 */
export function decodeMessage(
  schema: MessageSchema,
  body: Buffer,
  registry: SchemaRegistry,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const fields = readRawFields(stripNetBitStream(body));
  for (const rf of fields) {
    const fs = schema.fields.get(rf.field);
    if (!fs) continue; // 未知字段：跳过
    const value = decodeFieldValue(fs.type, fs.typeName, rf, registry);
    if (value === undefined) continue;
    if (fs.label === Label.REPEATED) {
      const arr = (out[rf.field] as unknown[]) ?? [];
      arr.push(value);
      out[rf.field] = arr;
    } else {
      out[rf.field] = value;
    }
  }
  return out;
}

/**
 * 剥离 NetBitStream 前缀，返回业务 protobuf 起点。
 *
 * 实证（backend logs/server.log C2S RAW 帧）：客户端所有 C2S body 形如
 *   `11 00 <userID ASCII> 0d 00 <token 13B> [业务 protobuf ...]`
 * 其中 `11 00` 为 NetBitStream 流标记、`0d 00` 为字符串长度前缀（13 = "localtoken123"）。
 * 剥掉后剩余部分才是业务消息的 protobuf；模式不匹配时按纯 protobuf 整体解析（容错）。
 */
export function stripNetBitStream(body: Buffer): Buffer {
  if (body.length >= 2 && body[0] === 0x11 && body[1] === 0x00) {
    // 找字符串长度前缀（0d 00 = 13B token），其后即业务 protobuf
    for (let i = 2; i < body.length - 2; i++) {
      if (body[i] === 0x0d && body[i + 1] === 0x00) {
        const start = i + 2 + 13;
        if (start <= body.length) return body.subarray(start);
      }
    }
  }
  return body;
}

function decodeFieldValue(
  type: FieldType,
  typeName: string | undefined,
  rf: RawField,
  registry: SchemaRegistry,
): unknown {
  switch (type) {
    case FieldType.INT32:
    case FieldType.INT64:
    case FieldType.UINT32:
    case FieldType.UINT64:
    case FieldType.ENUM:
    case FieldType.BOOL:
      return Number(decodeVarint(rf.data, 0).value);
    case FieldType.SINT32:
      return zigzagDecode(Number(decodeVarint(rf.data, 0).value));
    case FieldType.STRING:
      return rf.data.toString('utf-8');
    case FieldType.BYTES:
      return Buffer.from(rf.data);
    case FieldType.MESSAGE: {
      if (!typeName) return undefined;
      const sub = registry.resolve(typeName);
      if (!sub) return Buffer.from(rf.data); // 无 schema 时保留原始字节
      return decodeMessage(sub, rf.data, registry);
    }
    case FieldType.FIXED32:
    case FieldType.SFIXED32:
      return rf.data.readUInt32LE(0);
    case FieldType.FIXED64:
    case FieldType.SFIXED64:
      return rf.data.readBigUInt64LE(0).toString();
    default:
      return undefined;
  }
}

function zigzagDecode(n: number): number {
  return n % 2 === 0 ? n / 2 : -(Math.floor(n / 2) + 1);
}
