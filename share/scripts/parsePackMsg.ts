/**
 * parsePackMsg.ts — 解析 pack_msg（protobuf FileDescriptorSet），得到 message 与 enum 的
 * 结构化清单，供 gen 生成 TS interface / enum。
 *
 * 解析逻辑对齐 backend/src/proto/SchemaRegistry.ts：
 *  - 零依赖：直接用 readRawFields 把 FileDescriptorSet（本身也是 protobuf）拆成字段，
 *    再按 descriptor.proto 的字段号逐层解释。
 *  - 额外补充解析 enum 取值（EnumDescriptorProto.value），因为生成 TS enum 需要取值，
 *    SchemaRegistry 只需占位故不读。
 */
import * as fs from 'fs';
import { Buffer } from 'buffer';
import { FieldType, WireType } from '../src/common';

// 供 generate_* 脚本统一从 parsePackMsg 取用，避免重复 import 路径。
export { FieldType, WireType };

// ---- protobuf wire 读取原语 ----
const WIRE_VARINT = WireType.VARINT;
const WIRE_FIXED64 = WireType.FIXED64;
const WIRE_LENDELIM = WireType.LENDELIM;
const WIRE_FIXED32 = WireType.FIXED32;

interface RawField {
  field: number;
  wireType: number;
  data: Buffer;
}

function decodeVarint(buf: Buffer, offset = 0): { value: bigint; next: number } {
  let value = 0n;
  let shift = 0n;
  let i = offset;
  while (i < buf.length) {
    const b = buf[i++];
    value |= BigInt(b & 0x7f) << shift;
    if (!(b & 0x80)) return { value, next: i };
    shift += 7n;
  }
  throw new Error('varint 截断');
}

function readRawFields(buf: Buffer): RawField[] {
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

function group(buf: Buffer): Map<number, RawField[]> {
  const out = new Map<number, RawField[]>();
  for (const f of readRawFields(buf)) {
    let arr = out.get(f.field);
    if (!arr) {
      arr = [];
      out.set(f.field, arr);
    }
    arr.push(f);
  }
  return out;
}

function readString(m: Map<number, RawField[]>, key: number): string {
  const f = m.get(key)?.[0];
  return f ? f.data.toString('utf-8') : '';
}

function readInt(m: Map<number, RawField[]>, key: number): number {
  const f = m.get(key)?.[0];
  if (!f) return 0;
  // protobuf 以 64 位补码存整数，枚举负数（如 INVALID=-1）需按有符号 64 位解释再转 number。
  return Number(BigInt.asIntN(64, decodeVarint(f.data, 0).value));
}

// ---- descriptor.proto 字段号速查 ----
const FD = {
  // FileDescriptorProto
  FILE_PACKAGE: 2,
  FILE_MESSAGE_TYPE: 4,
  FILE_ENUM_TYPE: 5,
  // DescriptorProto
  MSG_NAME: 1,
  MSG_FIELD: 2,
  MSG_NESTED_TYPE: 3,
  MSG_ENUM_TYPE: 4,
  // FieldDescriptorProto
  FLD_NAME: 1,
  FLD_NUMBER: 3,
  FLD_LABEL: 4,
  FLD_TYPE: 5,
  FLD_TYPE_NAME: 6,
  // EnumDescriptorProto
  ENUM_NAME: 1,
  ENUM_VALUE: 2,
  // EnumValueDescriptorProto
  ENUMVAL_NAME: 1,
  ENUMVAL_NUMBER: 2,
} as const;

export enum Label {
  OPTIONAL = 1,
  REQUIRED = 2,
  REPEATED = 3,
}

export interface ParsedField {
  name: string;
  number: number;
  label: Label;
  type: FieldType;
  /** message / enum 类型全限定名（带前导点）。 */
  typeName?: string;
}

export interface ParsedMessage {
  fullName: string;
  /** 短名。 */
  name: string;
  fields: ParsedField[];
  fieldOrder: number[];
}

export interface ParsedEnumValue {
  name: string;
  number: number;
}

export interface ParsedEnum {
  fullName: string;
  /** 短名。 */
  name: string;
  values: ParsedEnumValue[];
}

export interface ParsedDescriptor {
  messages: ParsedMessage[];
  enums: ParsedEnum[];
}

/** 解析 FileDescriptorSet 字节到 message / enum 清单。 */
export function parsePackMsg(setBuf: Buffer): ParsedDescriptor {
  const messages: ParsedMessage[] = [];
  const enums: ParsedEnum[] = [];

  // FileDescriptorSet.file = field 1 (repeated FileDescriptorProto)
  const files = group(setBuf).get(1) || [];
  for (const f of files) parseFile(f.data);
  return { messages, enums };

  function parseFile(fileBuf: Buffer): void {
    const m = group(fileBuf);
    const pkg = readString(m, FD.FILE_PACKAGE);
    const prefix = pkg ? '.' + pkg : '';
    for (const msg of m.get(FD.FILE_MESSAGE_TYPE) || []) parseMessage(msg.data, prefix);
    for (const en of m.get(FD.FILE_ENUM_TYPE) || []) parseEnum(en.data, prefix);
  }

  function parseMessage(msgBuf: Buffer, prefix: string): void {
    const m = group(msgBuf);
    const name = readString(m, FD.MSG_NAME);
    const fullName = prefix ? prefix + '.' + name : '.' + name;

    const fields: ParsedField[] = [];
    const fieldOrder: number[] = [];
    for (const fld of m.get(FD.MSG_FIELD) || []) {
      const f = parseField(fld.data);
      if (f) {
        fields.push(f);
        fieldOrder.push(f.number);
      }
    }
    messages.push({ fullName, name, fields, fieldOrder });

    const childPrefix = fullName;
    for (const nested of m.get(FD.MSG_NESTED_TYPE) || []) parseMessage(nested.data, childPrefix);
    for (const nestedEnum of m.get(FD.MSG_ENUM_TYPE) || []) parseEnum(nestedEnum.data, childPrefix);
  }

  function parseField(fldBuf: Buffer): ParsedField | null {
    const m = group(fldBuf);
    const name = readString(m, FD.FLD_NAME);
    const number = readInt(m, FD.FLD_NUMBER);
    if (!number) return null;
    const label = readInt(m, FD.FLD_LABEL) as Label;
    const type = readInt(m, FD.FLD_TYPE) as FieldType;
    const typeName = readString(m, FD.FLD_TYPE_NAME) || undefined;
    return { name, number, label, type, typeName };
  }

  function parseEnum(enumBuf: Buffer, prefix: string): void {
    const m = group(enumBuf);
    const name = readString(m, FD.ENUM_NAME);
    const fullName = prefix ? prefix + '.' + name : '.' + name;
    const values: ParsedEnumValue[] = [];
    for (const v of m.get(FD.ENUM_VALUE) || []) {
      const vm = group(v.data);
      values.push({ name: readString(vm, FD.ENUMVAL_NAME), number: readInt(vm, FD.ENUMVAL_NUMBER) });
    }
    enums.push({ fullName, name, values });
  }
}

/** 从 pack_msg 文件路径加载并解析。 */
export function loadPackMsg(path: string): ParsedDescriptor {
  return parsePackMsg(fs.readFileSync(path));
}