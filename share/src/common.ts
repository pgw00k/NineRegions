/**
 * 底层定义复用层。
 * FieldType / WireType 同时被运行时（schema/codec）与生成脚本（parsePackMsg）共用，
 * 确保「种类判定」与「线格式」在共享层一致，不各自维护一份。
 */

/** 字段类型，与 descriptor.proto FieldDescriptorProto.Type 对齐。 */
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

/** protobuf wire 类型（描述字段在线格式中的编码方式）。 */
export enum WireType {
  VARINT = 0,
  FIXED64 = 1,
  LENDELIM = 2,
  FIXED32 = 5,
}

/** 保留线类型 7：标准 protobuf 未定义。producer 曾以「变长长度前缀 + 自描述 blob」写入，
 *  解码时按长度前缀跳过并丢弃该未知字段，避免崩溃并保证后续字段对齐。 */
export const WIRE_RESERVED = 7;

/** 字段 tag = (fieldNumber << 3) | wireType，wire 部分占低 3 位。 */
export const WIRE_TYPE_MASK = 0x7;