/**
 * ProtobufCodec.ts — protobuf 线格式底层原语（零依赖自研）。
 *
 * 提供：
 *  - 变长整数（varint）编/解码（支持 64 位 BigInt）
 *  - ZigZag 编码（sint32 / sint64）
 *  - 字段类型 → 线类型(wire type) 映射
 *  - readRawFields：把一段 protobuf 字节拆成 (field, wireType, data) 列表
 *
 * 这些原语同时服务于两处：
 *  1) SchemaRegistry 用它解析 pack_msg（FileDescriptorSet 本身也是 protobuf）；
 *  2) ProtobufEncoder 用它把 mock 数据编码成业务 protobuf 字节。
 */
import { Buffer } from 'buffer';

/** descriptor.proto 的 FieldDescriptorProto.Type 枚举（仅保留用得到的含义）。 */
export enum FieldType {
  DOUBLE = 1,
  FLOAT = 2,
  INT64 = 3,
  UINT64 = 4,
  INT32 = 5,
  FIXED64 = 6,
  FIXED32 = 7,
  BOOL = 8,
  STRING = 9,
  GROUP = 10,
  MESSAGE = 11,
  BYTES = 12,
  UINT32 = 13,
  ENUM = 14,
  SFIXED32 = 15,
  SFIXED64 = 16,
  SINT32 = 17,
  SINT64 = 18,
}

export enum Label {
  OPTIONAL = 1,
  REQUIRED = 2,
  REPEATED = 3,
}

export const WIRE_VARINT = 0;
export const WIRE_FIXED64 = 1;
export const WIRE_LENDELIM = 2;
export const WIRE_FIXED32 = 5;

/** 线类型枚举（语义化别名，等价上面的 WIRE_* 常量）。 */
export enum WireType {
  Varint = 0,
  Fixed64 = 1,
  LengthDelimited = 2,
  Fixed32 = 5,
}

/** 字段类型 → 线类型。 */
export function wireTypeFor(type: FieldType): number {
  switch (type) {
    case FieldType.INT64:
    case FieldType.UINT64:
    case FieldType.INT32:
    case FieldType.BOOL:
    case FieldType.UINT32:
    case FieldType.ENUM:
    case FieldType.SINT32:
    case FieldType.SINT64:
      return WIRE_VARINT;
    case FieldType.FIXED64:
    case FieldType.SFIXED64:
    case FieldType.DOUBLE:
      return WIRE_FIXED64;
    case FieldType.FIXED32:
    case FieldType.SFIXED32:
    case FieldType.FLOAT:
      return WIRE_FIXED32;
    case FieldType.STRING:
    case FieldType.BYTES:
    case FieldType.MESSAGE:
    case FieldType.GROUP:
      return WIRE_LENDELIM;
    default:
      throw new Error(`未知 protobuf 字段类型: ${type}`);
  }
}

/** 把任意整数 / 大整数 / 数字字符串编码为 varint 字节。 */
export function encodeVarint(value: number | bigint | string): Buffer {
  let v: bigint =
    typeof value === 'bigint'
      ? value
      : typeof value === 'string'
        ? BigInt(value)
        : BigInt(Math.trunc(value));
  // 统一成无符号 64 位表示（protobuf int64 以 64 位补码存储）
  v = v & 0xffffffffffffffffn;
  const bytes: number[] = [];
  while (true) {
    const b = Number(v & 0x7fn);
    v >>= 7n;
    if (v !== 0n) {
      bytes.push(b | 0x80);
    } else {
      bytes.push(b);
      break;
    }
  }
  return Buffer.from(bytes);
}

/** 从 buf[offset] 解码 varint，返回 { value, next }。 */
export function decodeVarint(
  buf: Buffer,
  offset = 0,
): { value: bigint; next: number } {
  let value = 0n;
  let shift = 0n;
  let i = offset;
  while (i < buf.length) {
    const b = buf[i++];
    value |= BigInt(b & 0x7f) << shift;
    if (!(b & 0x80)) {
      return { value, next: i };
    }
    shift += 7n;
  }
  throw new Error('varint 截断');
}

/** ZigZag 编码（sint32 / sint64）。 */
export function zigzag64(value: bigint): bigint {
  return (value << 1n) ^ (value >> 63n);
}
export function zigzag32(value: number): number {
  return ((value << 1) ^ (value >> 31)) & 0xffffffff;
}

/** 单字段的 tag 字节：(fieldNumber << 3) | wireType。 */
export function encodeTag(fieldNumber: number, wireType: number): Buffer {
  return encodeVarint((fieldNumber << 3) | wireType);
}

export interface RawField {
  field: number;
  wireType: number;
  /** 值字节：wire0=varint 原始字节；wire1=8B；wire5=4B；wire2=长度界定内容。 */
  data: Buffer;
}

/** 把一段 protobuf 消息字节拆成有序的原始字段列表。 */
export function readRawFields(buf: Buffer): RawField[] {
  const out: RawField[] = [];
  let i = 0;
  while (i < buf.length) {
    const tag = decodeVarint(buf, i);
    i = tag.next;
    const field = Number(tag.value >> 3n);
    const wireType = Number(tag.value & 7n);
    let data: Buffer;
    if (wireType === WIRE_VARINT) {
      const v = decodeVarint(buf, i);
      i = v.next;
      // 回存 varint 原始字节，便于后续再解码为具体数值
      let end = i;
      while (end > 0 && buf[end - 1] !== undefined && !(buf[end - 1] & 0x80) && end > tag.next - 1) {
        break;
      }
      data = buf.subarray(tag.next, i);
    } else if (wireType === WIRE_LENDELIM) {
      const len = decodeVarint(buf, i);
      i = len.next;
      data = buf.subarray(i, i + Number(len.value));
      i += Number(len.value);
    } else if (wireType === WIRE_FIXED64) {
      data = buf.subarray(i, i + 8);
      i += 8;
    } else if (wireType === WIRE_FIXED32) {
      data = buf.subarray(i, i + 4);
      i += 4;
    } else {
      throw new Error(`不支持的线类型 ${wireType}`);
    }
    out.push({ field, wireType, data });
  }
  return out;
}

/** 从 wire0 的 data 解码 varint 数值（bigint）。 */
export function rawVarintValue(data: Buffer): bigint {
  return decodeVarint(data, 0).value;
}

/** 小端写入 32 位定长。 */
export function encodeFixed32(value: number): Buffer {
  const b = Buffer.allocUnsafe(4);
  b.writeUInt32LE(value >>> 0, 0);
  return b;
}

/** 小端写入 64 位定长（按无符号解释）。 */
export function encodeFixed64(value: number | bigint | string): Buffer {
  let v: bigint =
    typeof value === 'bigint'
      ? value
      : typeof value === 'string'
      ? BigInt(value)
      : BigInt(Math.trunc(value));
  v = v & 0xffffffffffffffffn;
  const b = Buffer.allocUnsafe(8);
  b.writeUInt32LE(Number(v & 0xffffffffn), 0);
  b.writeUInt32LE(Number((v >> 32n) & 0xffffffffn), 4);
  return b;
}

/** IEEE754 单精度（float）4 字节小端。 */
export function encodeFloat32(value: number): Buffer {
  const b = Buffer.allocUnsafe(4);
  b.writeFloatLE(value, 0);
  return b;
}

/** IEEE754 双精度（double）8 字节小端。 */
export function encodeFloat64(value: number): Buffer {
  const b = Buffer.allocUnsafe(8);
  b.writeDoubleLE(value, 0);
  return b;
}
