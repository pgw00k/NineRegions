/**
 * message_ex.ts —— 手工补充的消息类型声明。
 *
 * 本文件刻意独立于 generate_ts 生成的 messages.ts / fields.ts：
 * 对于「不在 pack_msg（来自 proto）中、但确需在协议里出现的消息体」，
 * 只在这里声明 TS 类型，避免手工改动会被重新生成覆盖的文件。
 *
 * 字段的静态登记（define(...) 空结构）与 MESSAGE_ID 映射（ID_BY_NAME[...]）
 * 由 generate_ts 在生成 fields.ts 时，根据 msg_ex/*.json 的 reqProto/recvProto
 * 自动补出（无法在 pack_msg 解析到的名字即视为本文件声明的手工类型）。
 */
export interface ShowEndRequest {
}