/**
 * codec.ts — 静态 protobuf 编解码器（共享层）。
 *
 * 操作 byNumber 的 MessageSchema（字段号/种类表，由 generate_ts 生成的 fields.ts 通过
 * schema.define 登记），直接读写「以字段名为 key」的对象，不依赖任何动态 proto。
 *
 * 种类判定使用 common.ts 的 FieldType 数值枚举，线格式使用 common.ts 的 WireType；
 * 嵌套 message 通过 schema.getByName 解析拍平类型名。
 */
import { Buffer } from 'buffer';
import { FieldSchema, MessageSchema, getByName } from './schema';
import { FieldType, WireType, WIRE_RESERVED } from './common';

// ---------------------------------------------------------------------------
// 线格式原语
// ---------------------------------------------------------------------------
function writeVarint(acc: Buffer[], value: number | bigint): void {
  let v = BigInt(value);
  if (v < 0n) v = BigInt.asUintN(64, v); // 负数以 64 位补码写出（int32 负值亦然）
  const bytes: number[] = [];
  while (v >= 0x80n) {
    bytes.push(Number(v & 0x7fn) | 0x80);
    v >>= 7n;
  }
  bytes.push(Number(v));
  acc.push(Buffer.from(bytes));
}

interface VarintRead {
  value: bigint;
  size: number;
}

function readVarint(buf: Buffer, off: number): VarintRead {
  let value = 0n;
  let shift = 0n;
  let i = off;
  for (;;) {
    const byte = buf[i++];
    value |= BigInt(byte & 0x7f) << shift;
    if ((byte & 0x80) === 0) break;
    shift += 7n;
  }
  return { value, size: i - off };
}

/** raw 字段：按线格式抓出的最小可消费单位。 */
interface RawField {
  field: number;
  wire: number;
  /** wire0 的 varint 值。 */
  varint?: bigint;
  /** wire1/2/5 的载荷字节。 */
  data?: Buffer;
}

function readFields(buf: Buffer): RawField[] {
  const out: RawField[] = [];
  let off = 0;
  while (off < buf.length) {
    const tag = readVarint(buf, off);
    off += tag.size;
    const t = Number(tag.value);
    const field = t >>> 3;
    const wire = t & 7;
    if (wire === WireType.VARINT) {
      const v = readVarint(buf, off);
      off += v.size;
      out.push({ field, wire, varint: v.value });
    } else if (wire === WireType.FIXED64) {
      out.push({ field, wire, data: buf.subarray(off, off + 8) });
      off += 8;
    } else if (wire === WireType.LENDELIM) {
      const len = readVarint(buf, off);
      off += len.size;
      const n = Number(len.value);
      out.push({ field, wire, data: buf.subarray(off, off + n) });
      off += n;
    } else if (wire === WireType.FIXED32) {
      out.push({ field, wire, data: buf.subarray(off, off + 4) });
      off += 4;
    } else if (wire === WIRE_RESERVED) {
      // 保留线类型 7（标准 protobuf 未定义）：按变长长度前缀跳过该未知字段并丢弃，
      // 不透传、不崩溃，保证其后字段仍对齐。producer 以长度前缀写入自描述 blob。
      const len = readVarint(buf, off);
      off += len.size + Number(len.value);
    } else {
      throw new Error(`codec: 不支持的 wire type ${wire}`);
    }
  }
  return out;
}

function zigzagDecode(n: number): number {
  return n % 2 === 0 ? n / 2 : -(Math.floor(n / 2) + 1);
}

function zigzag32(n: number): number {
  return (n << 1) ^ (n >> 31);
}

function zigzag64(n: bigint): bigint {
  return (n << 1n) ^ (n >> 63n);
}

function coerceBytes(value: unknown): Buffer {
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof Uint8Array) return Buffer.from(value);
  if (typeof value === 'string') return Buffer.from(value, 'utf-8');
  return Buffer.alloc(0);
}

// ---------------------------------------------------------------------------
// 编码：字段名对象 -> protobuf 字节
// ---------------------------------------------------------------------------
export function encodeMessage(schema: MessageSchema, obj: Record<string, unknown>): Buffer {
  const acc: Buffer[] = [];
  for (const f of schema.fields) {
    const value = (obj as Record<string, unknown>)[f.name];
    if (value === undefined || value === null) continue;
    if (f.repeated) {
      const arr = Array.isArray(value) ? value : [value];
      for (const item of arr) {
        if (item === undefined || item === null) continue;
        appendField(acc, f, item);
      }
    } else {
      appendField(acc, f, value);
    }
  }
  return Buffer.concat(acc);
}

function appendField(acc: Buffer[], f: FieldSchema, value: unknown): void {
  writeVarint(acc, (f.number << 3) | f.wire); // tag
  switch (f.wire) {
    case WireType.VARINT:
      switch (f.kind) {
        case FieldType.BOOL:
          writeVarint(acc, value ? 1 : 0);
          break;
        case FieldType.SINT32:
          writeVarint(acc, zigzag32(Number(value)));
          break;
        case FieldType.SINT64:
          writeVarint(acc, zigzag64(BigInt(value as number | string | bigint)));
          break;
        default:
          writeVarint(acc, Number(value)); // int/uint/enum（int64 在 Number 精度内）
          break;
      }
      return;
    case WireType.FIXED64: {
      const b = Buffer.alloc(8);
      if (f.kind === FieldType.DOUBLE) b.writeDoubleLE(Number(value));
      else b.writeBigInt64LE(BigInt(value as number | string | bigint));
      acc.push(b);
      return;
    }
    case WireType.FIXED32: {
      const b = Buffer.alloc(4);
      if (f.kind === FieldType.FLOAT) b.writeFloatLE(Number(value));
      else b.writeInt32LE(Number(value)); // fixed32/sfixed32 低 32 位
      acc.push(b);
      return;
    }
    case WireType.LENDELIM: {
      if (f.kind === FieldType.MESSAGE) {
        const sub = f.typeName ? getByName(f.typeName) : undefined;
        const inner = sub ? encodeMessage(sub, value as Record<string, unknown>) : Buffer.alloc(0);
        writeVarint(acc, inner.length);
        acc.push(inner);
      } else if (f.kind === FieldType.STRING) {
        const b = Buffer.from(String(value), 'utf-8');
        writeVarint(acc, b.length);
        acc.push(b);
      } else if (f.kind === FieldType.BYTES) {
        const b = coerceBytes(value);
        writeVarint(acc, b.length);
        acc.push(b);
      }
      return;
    }
    default:
      throw new Error(`codec: 未知 wire type ${f.wire}`);
  }
}

// ---------------------------------------------------------------------------
// 解码：protobuf 字节 -> 字段名对象
// ---------------------------------------------------------------------------
export function decodeMessage(schema: MessageSchema, body: Buffer): Record<string, unknown> {
  const byNumber = new Map<number, FieldSchema>();
  for (const f of schema.fields) byNumber.set(f.number, f);

  const out: Record<string, unknown> = {};
  for (const r of readFields(body)) {
    const f = byNumber.get(r.field);
    if (!f) continue; // 未知字段号：跳过
    const value = decodeField(f, r);
    if (value === undefined) continue;
    if (f.repeated) {
      const arr = ((out[f.name] as unknown[]) ??= []);
      arr.push(value);
    } else {
      out[f.name] = value;
    }
  }
  return out;
}

function decodeField(f: FieldSchema, r: RawField): unknown {
  switch (f.wire) {
    case WireType.VARINT: {
      const raw = Number(r.varint ?? 0n);
      switch (f.kind) {
        case FieldType.BOOL:
          return raw !== 0;
        case FieldType.SINT32:
        case FieldType.SINT64:
          return zigzagDecode(raw);
        default:
          return raw; // int/uint/enum
      }
    }
    case WireType.FIXED64: {
      const data = r.data!;
      if (f.kind === FieldType.DOUBLE) return data.readDoubleLE(0);
      if (f.kind === FieldType.FIXED64) return Number(data.readBigUInt64LE(0));
      return Number(data.readBigInt64LE(0)); // sfixed64
    }
    case WireType.FIXED32: {
      const data = r.data!;
      if (f.kind === FieldType.FLOAT) return data.readFloatLE(0);
      if (f.kind === FieldType.FIXED32) return data.readUInt32LE(0);
      return data.readInt32LE(0); // sfixed32
    }
    case WireType.LENDELIM: {
      const data = r.data!;
      switch (f.kind) {
        case FieldType.STRING:
          return data.toString('utf-8');
        case FieldType.BYTES:
          return Buffer.from(data);
        case FieldType.MESSAGE: {
          const sub = f.typeName ? getByName(f.typeName) : undefined;
          return sub ? decodeMessage(sub, data) : Buffer.from(data);
        }
        default:
          return undefined;
      }
    }
    default:
      return undefined;
  }
}