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
  /** 登记用的消息号（MESSAGE_ID）；非网络消息为 0 占位。 */
  id: number;
  /** 拍平消息名（嵌套解析依据）。 */
  name: string;
  /** 按字段号升序。 */
  fields: FieldSchema[];
}

const REG_ID: Record<number, MessageSchema> = {};
const REG_NAME: Record<string, MessageSchema> = {};

/** 登记一个消息：既按消息号（id）注册，也按拍平名（name）注册以便嵌套解析。 */
export function define(id: number, name: string, fields: FieldSchema[]): MessageSchema {
  const sorted = [...fields].sort((a, b) => a.number - b.number);
  const s: MessageSchema = { id, name, fields: sorted };
  REG_ID[id] = s;
  REG_NAME[name] = s;
  return s;
}

/** 按消息号取 schema（网络请求/响应）。 */
export function get(id: number): MessageSchema | undefined {
  return REG_ID[id];
}

/** 按拍平类型名取 schema（嵌套 message 解析）。 */
export function getByName(name: string): MessageSchema | undefined {
  return REG_NAME[name];
}