export * from './proto';
export * from './MESSAGE_ID';
export * from './common';
// schema（字段号/种类静态表）由 generate_ts 生成的 fields.ts 通过 define 登记；
// codec 为该表上的静态编解码器，供 backend 以「字段名为 key」的对象直接编解码。
export * from './schema';
export { encodeMessage, decodeMessage } from './codec';