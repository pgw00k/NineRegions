/**
 * SchemaRegistry.ts — 解析 pack_msg（protobuf FileDescriptorSet），建立
 * 「消息名 → 字段 schema」映射，供 ProtobufEncoder 按字段号递归编码 mock 数据。
 *
 * 设计要点：
 *  - 零依赖：直接用 ProtobufCodec 的 readRawFields 把任意 protobuf 消息拆成
 *    { fieldNumber -> RawField[] }，再按 descriptor.proto 的字段号逐层解释。
 *  - 同时登记「全限定名」（带前导点，如 ".LoginBySDKRequest"）与「短名」索引；
 *    mock 注册表（message-registry.json）用的是短名，故短名查找为主。
 *  - 嵌套 message / enum 递归登记，message 字段可据此解析子 schema 做递归编码。
 */
import * as fs from 'fs';
import { Buffer } from 'buffer';
import { FieldType, Label, readRawFields, RawField, decodeVarint } from './ProtobufCodec';

/** descriptor.proto 字段号速查（只列用得到的）。 */
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
} as const;

export interface FieldSchema {
  /** 字段号（protobuf 线格式用）。 */
  number: number;
  /** 字段名（仅文档/调试用，mock 用字段号做 key）。 */
  name: string;
  /** 字段类型（FieldType 枚举）。 */
  type: FieldType;
  /** 标签（optional/required/repeated）。 */
  label: Label;
  /** message/enum 类型名（带前导点，如 ".LoginBySDKRequest"）。 */
  typeName?: string;
}

export interface MessageSchema {
  /** 全限定名（带前导点）。 */
  fullName: string;
  /** 短名。 */
  name: string;
  /** 字段号 -> 字段 schema。 */
  fields: Map<number, FieldSchema>;
  /** 字段号出现顺序（保证编码确定性）。 */
  fieldOrder: number[];
}

/** 把一段 protobuf 字节按字段号分组。 */
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
  return f ? Number(decodeVarint(f.data, 0).value) : 0;
}

export class SchemaRegistry {
  private byFullName = new Map<string, MessageSchema>();
  private byShortName = new Map<string, MessageSchema>();

  /** 从 pack_msg 文件加载并解析。 */
  static load(path: string): SchemaRegistry {
    const buf = fs.readFileSync(path);
    const reg = new SchemaRegistry();
    reg.parse(buf);
    return reg;
  }

  private parse(setBuf: Buffer): void {
    // FileDescriptorSet.file = field 1 (repeated FileDescriptorProto)
    const files = group(setBuf).get(1) || [];
    for (const f of files) {
      this.parseFile(f.data);
    }
  }

  private parseFile(fileBuf: Buffer): void {
    const m = group(fileBuf);
    const pkg = readString(m, FD.FILE_PACKAGE);
    const prefix = pkg ? '.' + pkg : '';
    for (const msg of m.get(FD.FILE_MESSAGE_TYPE) || []) {
      this.parseMessage(msg.data, prefix);
    }
    for (const en of m.get(FD.FILE_ENUM_TYPE) || []) {
      this.parseEnum(en.data, prefix);
    }
  }

  private parseMessage(msgBuf: Buffer, prefix: string): void {
    const m = group(msgBuf);
    const name = readString(m, FD.MSG_NAME);
    const fullName = prefix ? prefix + '.' + name : '.' + name;

    const fields = new Map<number, FieldSchema>();
    const fieldOrder: number[] = [];
    for (const fld of m.get(FD.MSG_FIELD) || []) {
      const fs = this.parseField(fld.data);
      if (fs) {
        fields.set(fs.number, fs);
        fieldOrder.push(fs.number);
      }
    }

    const schema: MessageSchema = { fullName, name, fields, fieldOrder };
    this.register(fullName, name, schema);

    // 嵌套类型（字段号 3）与前缀拼接
    const childPrefix = fullName;
    for (const nested of m.get(FD.MSG_NESTED_TYPE) || []) {
      this.parseMessage(nested.data, childPrefix);
    }
    for (const nestedEnum of m.get(FD.MSG_ENUM_TYPE) || []) {
      this.parseEnum(nestedEnum.data, childPrefix);
    }
  }

  private parseField(fldBuf: Buffer): FieldSchema | null {
    const m = group(fldBuf);
    const name = readString(m, FD.FLD_NAME);
    const number = readInt(m, FD.FLD_NUMBER);
    if (!number) return null;
    const label = readInt(m, FD.FLD_LABEL) as Label;
    const type = readInt(m, FD.FLD_TYPE) as FieldType;
    const typeName = readString(m, FD.FLD_TYPE_NAME) || undefined;
    return { number, name, type, label, typeName };
  }

  private parseEnum(enumBuf: Buffer, prefix: string): void {
    const m = group(enumBuf);
    const name = readString(m, FD.ENUM_NAME);
    const fullName = prefix ? prefix + '.' + name : '.' + name;
    // 枚举仅用于类型解析占位；编码时 enum 字段按整型 varint 处理，无需字段表。
    if (!this.byFullName.has(fullName)) {
      this.byFullName.set(fullName, { fullName, name, fields: new Map(), fieldOrder: [] });
    }
  }

  private register(fullName: string, shortName: string, schema: MessageSchema): void {
    this.byFullName.set(fullName, schema);
    if (!this.byShortName.has(shortName)) {
      this.byShortName.set(shortName, schema);
    }
    // 短名冲突（不同 package 同名）保留首个，编码时按短名会命中首个；
    // 若确需精确，调用方应使用全限定名或传入 type_name 解析。
  }

  getByShortName(shortName: string): MessageSchema | undefined {
    return this.byShortName.get(shortName);
  }

  getByFullName(fullName: string): MessageSchema | undefined {
    return this.byFullName.get(fullName);
  }

  /** 解析 type_name（".pkg.Foo" 或 ".Foo"）到 schema；失败回退按短名末段匹配。 */
  resolve(typeName: string): MessageSchema | undefined {
    const direct = this.byFullName.get(typeName);
    if (direct) return direct;
    const short = typeName.replace(/^.*\./, '');
    return this.byShortName.get(short);
  }

  get messageCount(): number {
    return this.byFullName.size;
  }
}
