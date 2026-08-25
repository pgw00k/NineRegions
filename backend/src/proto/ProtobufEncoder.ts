/**
 * ProtobufEncoder.ts — 把「以字段号(key)为键」的 mock 对象递归编码成 protobuf 字节。
 *
 * 约定（来自设计决策）：
 *  - mock JSON 用「字段号」做 key（规避 protobufjs 字段名歧义），如 { "1": "1", "2": 0 }。
 *  - 字段类型由 SchemaRegistry 提供，保证 varint/string/bytes/message/repeated/enum/fixed
 *    各自的线格式正确（含 sint 的 ZigZag、float/double 定长、嵌套 message 递归）。
 *  - 值类型到编码的映射：
 *      number/boolean/整型枚举 -> varint（bool 取 0/1；sint 走 ZigZag）
 *      string                 -> length-delimited UTF-8
 *      bytes                  -> length-delimited 原始字节（支持 {hex}/{b64} 或纯 hex/base64 字符串）
 *      object                 -> 嵌套 message（递归，同样字段号 keyed）
 *      array                  -> repeated（每个元素按元素类型编码，非 packed）
 */
import { Buffer } from 'buffer';
import {
  FieldType,
  Label,
  wireTypeFor,
  encodeTag,
  encodeVarint,
  zigzag32,
  zigzag64,
  encodeFixed32,
  encodeFixed64,
  encodeFloat32,
  encodeFloat64,
} from './ProtobufCodec';
import { SchemaRegistry, MessageSchema, FieldSchema } from './SchemaRegistry';

export interface EncodeOptions {
  /** 遇到 schema 未定义的字段号时跳过并告警（默认 true）；false 则抛错。 */
  skipUnknownFields?: boolean;
}

/** 把任意数值/布尔转成可喂给 encodeVarint 的值（布尔 -> 0/1）。 */
function coerceInt(value: unknown): number | bigint | string {
  if (typeof value === 'boolean') return value ? 1 : 0;
  return value as number | bigint | string;
}

/** 把 bytes 字段值解码成 Buffer。 */
function decodeBytes(value: unknown): Buffer {
  if (Buffer.isBuffer(value)) return value;
  if (value && typeof value === 'object') {
    const o = value as Record<string, unknown>;
    if (typeof o.hex === 'string') return Buffer.from(o.hex, 'hex');
    if (typeof o.b64 === 'string') return Buffer.from(o.b64, 'base64');
    if (typeof o.base64 === 'string') return Buffer.from(o.base64, 'base64');
  }
  if (typeof value === 'string') {
    const s = value.trim();
    if (s.length === 0) return Buffer.alloc(0);
    if (/^[0-9a-fA-F]+$/.test(s) && s.length % 2 === 0) return Buffer.from(s, 'hex');
    return Buffer.from(s, 'base64');
  }
  return Buffer.alloc(0);
}

export class ProtobufEncoder {
  constructor(private registry: SchemaRegistry) {}

  /** 编码一个消息对象（字段号 keyed）为 protobuf 字节。 */
  encode(schema: MessageSchema, obj: Record<string, unknown>, opts: EncodeOptions = {}): Buffer {
    const skipUnknown = opts.skipUnknownFields ?? true;
    const chunks: Buffer[] = [];
    for (const key of Object.keys(obj)) {
      const fnum = Number(key);
      if (!Number.isInteger(fnum)) continue;
      const field = schema.fields.get(fnum);
      if (!field) {
        if (skipUnknown) continue; // 不认识的字段号：忽略（mock 健壮性优先）
        throw new Error(`Schema ${schema.fullName} 不含字段号 ${fnum}`);
      }
      const value = obj[key];
      if (value === undefined || value === null) continue;
      this.encodeField(chunks, field, value);
    }
    return Buffer.concat(chunks);
  }

  private encodeField(chunks: Buffer[], field: FieldSchema, value: unknown): void {
    if (field.label === Label.REPEATED) {
      const arr = Array.isArray(value) ? value : [value];
      for (const item of arr) {
        if (item === undefined || item === null) continue;
        this.appendField(chunks, field, item);
      }
    } else {
      this.appendField(chunks, field, value);
    }
  }

  private appendField(chunks: Buffer[], field: FieldSchema, value: unknown): void {
    const tag = encodeTag(field.number, wireTypeFor(field.type));
    switch (field.type) {
      case FieldType.INT32:
      case FieldType.INT64:
      case FieldType.UINT32:
      case FieldType.UINT64:
      case FieldType.BOOL:
      case FieldType.ENUM: {
        chunks.push(Buffer.concat([tag, encodeVarint(coerceInt(value))]));
        return;
      }
      case FieldType.SINT32: {
        chunks.push(Buffer.concat([tag, encodeVarint(zigzag32(Number(coerceInt(value))))]));
        return;
      }
      case FieldType.SINT64: {
        chunks.push(Buffer.concat([tag, encodeVarint(zigzag64(BigInt(coerceInt(value) as number | string | bigint)))]));
        return;
      }
      case FieldType.STRING: {
        const b = Buffer.from(String(value), 'utf-8');
        chunks.push(Buffer.concat([tag, encodeVarint(b.length), b]));
        return;
      }
      case FieldType.BYTES: {
        const b = decodeBytes(value);
        chunks.push(Buffer.concat([tag, encodeVarint(b.length), b]));
        return;
      }
      case FieldType.MESSAGE: {
        const sub = field.typeName ? this.registry.resolve(field.typeName) : undefined;
        if (!sub) {
          throw new Error(`无法解析 message 字段 ${field.number} 的 type_name=${field.typeName}`);
        }
        if (typeof value !== 'object' || value === null) {
          throw new Error(`message 字段 ${field.number} 需要对象值`);
        }
        const inner = this.encode(sub, value as Record<string, unknown>);
        chunks.push(Buffer.concat([tag, encodeVarint(inner.length), inner]));
        return;
      }
      case FieldType.FLOAT: {
        chunks.push(Buffer.concat([tag, encodeFloat32(Number(value))]));
        return;
      }
      case FieldType.DOUBLE: {
        chunks.push(Buffer.concat([tag, encodeFloat64(Number(value))]));
        return;
      }
      case FieldType.FIXED32:
      case FieldType.SFIXED32: {
        chunks.push(Buffer.concat([tag, encodeFixed32(Number(coerceInt(value)))]));
        return;
      }
      case FieldType.FIXED64:
      case FieldType.SFIXED64: {
        chunks.push(Buffer.concat([tag, encodeFixed64(coerceInt(value))]));
        return;
      }
      case FieldType.GROUP:
        throw new Error('GROUP 类型已废弃，不支持编码');
      default:
        throw new Error(`未知字段类型 ${field.type}`);
    }
  }
}
