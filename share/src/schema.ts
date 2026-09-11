// 字段号/种类静态表：运行期编解码不依赖动态 proto。
// 由 generate_ts 生成的 fields.ts 通过 define() 在此登记各消息的字段结构。

import { FieldType, WireType } from './common';

export interface FieldSchema {
  /** 字段名（供以 name 为 key 的对象访问）。 */
  name: string;
  /** 字段号（protobuf 线格式）。 */
  number: number;
  /** 字段种类：使用数值 FieldType 而非字符串，节省判定开销。 */
  kind: FieldType;
  repeated: boolean;
  /** message/enum 的拍平类型名；纯标量字段缺省。 */
  typeName?: string;
  wire: WireType;
}

export interface MessageSchema {
  /** 拍平消息名（嵌套解析依据）。 */
  name: string;
  /** 按字段号升序。 */
  fields: FieldSchema[];
}

const REG_NAME: Record<string, MessageSchema> = {};

/** MESSAGE_ID -> recvProto 拍平名；供 codec 运行时由 id 反查字段格式。 */
export const ID_BY_NAME: Record<number, string> = {};

/** 登记一个消息：仅按拍平名（name）注册字段格式，避免同一 recvProto 被多次完整登记。 */
export function define(name: string, fields: FieldSchema[]): MessageSchema {
  const sorted = [...fields].sort((a, b) => a.number - b.number);
  const s: MessageSchema = { name, fields: sorted };
  if (!REG_NAME[name]) {
    REG_NAME[name] = s;
  }
  return s;
}

/** 按消息号取 schema：先通过 ID_BY_NAME 反查名称，再取字段格式。 */
export function get(id: number): MessageSchema | undefined {
  const name = ID_BY_NAME[id];
  return name ? getByName(name) : undefined;
}

/** 按拍平类型名取 schema（嵌套 message 解析）。 */
export function getByName(name: string): MessageSchema | undefined {
  return REG_NAME[name];
}