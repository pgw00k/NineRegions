/**
 * FrameCodec.ts — 线格式编解码（复刻参考网关 gateway.py 的 build_msg / parse_plain / _wrap_dynproto）。
 *
 * 协议事实（来自 HANDOFF.md / Note.md 实证）：
 *  - S2C / C2S（明文）帧: [bodyLen u32 LE][order u32 LE][msgId u16 LE][body]
 *      - ★bodyLen = body 的字节数：即「不含 10B 头 + 不含 msgId 2B」的消息体长度，
 *        客户端从 msgId 之后连续读 bodyLen 字节作为 body（真实抓包 EnterGame 10002 应答
 *        实测 bodyLen=body.length，客户端可正确解析 MsgBody）。
 *        ⚠️ 坑：若 bodyLen 误写成 body.length + 2（误含 msgId 2B），客户端会越过 body 末尾
 *        多读 2B，导致能解出 msgId 但判 MsgBodyExists=false、解析 MsgBody 失败
 *        （2026-08-28 实证）。
 *  - 业务 protobuf body 外套 dynproto 头: [4B 零][4B LE 长度][pbuf]，小体补零到 28B
 */
import { Buffer } from 'buffer';

/**
 * 构造一条 S2C 应答帧。
 * bodyLen = body 字节数（不含 10B 头 + 不含 msgId 2B），与客户端解码约定一致
 * （2026-08-28 实证：写 body.length + 2 会让客户端多读 2B → MsgBodyExists=false）。
 */
export function buildS2C(msgId: number, order: number, body: Buffer): Buffer {
  const header = Buffer.allocUnsafe(10);
  header.writeUInt32LE(body.length & 0xffffffff, 0); // bodyLen（不含 msgId）
  header.writeUInt32LE(order & 0xffffffff, 4); // order
  header.writeUInt16LE(msgId & 0xffff, 8); // msgId
  return Buffer.concat([header, body]);
}

/** 解析 Frida 明文侧信道帧（C2S 明文）。失败返回 null。 */
export function parsePlain(
  buf: Buffer,
): { msgId: number; order: number; body: Buffer } | null {
  if (buf.length < 10) return null;
  const bodyLen = buf.readUInt32LE(0);
  const order = buf.readUInt32LE(4);
  const msgId = buf.readUInt16LE(8);
  let body: Buffer;
  // bodyLen = body 字节数（不含 10B 头 + 不含 msgId）；body 从字节 10 起、长 bodyLen
  if (bodyLen === 0) {
    body = Buffer.alloc(0);
  } else if (10 + bodyLen > buf.length) {
    body = buf.subarray(10); // 容错：取剩余全部
  } else {
    body = buf.subarray(10, 10 + bodyLen);
  }
  return { msgId, order, body };
}

/**
 * 把内部 protobuf 字节包装成客户端期望的 dynproto 体。
 * @param tiny  true → 补零到 28 字节（小体，参考网关 _wrap_dynproto）；false → 不补（_wrap_dynproto_long）
 */
export function wrapDynProto(pbuf: Buffer, tiny: boolean): Buffer {
  const header = Buffer.allocUnsafe(8);
  header.writeUInt32LE(0, 0); // 4B 零头
  header.writeUInt32LE(pbuf.length & 0xffffffff, 4); // 4B LE 长度
  let out = Buffer.concat([header, pbuf]);
  if (tiny && out.length < 28) {
    const pad = Buffer.alloc(28 - out.length);
    out = Buffer.concat([out, pad]);
  }
  return out;
}

/** 从 S2C body 中拆出内部 protobuf 字节（去掉 8B dynproto 头）。供需要解析客户端请求体时使用。 */
export function unwrapDynProto(body: Buffer): Buffer | null {
  if (body.length < 8) return null;
  const len = body.readUInt32LE(4);
  const start = 8;
  if (len > body.length - start) return body.subarray(start);
  return body.subarray(start, start + len);
}

/** 连接建立后主动下发的 CONNECTION_REQUEST_ACCEPTED(=1) 空体帧。 */
export function buildConnectionAccepted(): Buffer {
  return buildS2C(1, 0, Buffer.alloc(0));
}

/**
 * 自动选择 dynproto 包裹方式：
 *  - 内部 protobuf 为空（0B）→ 8B 空体（[4B头=0][4B len=0]），与真实服务端空响应一致
 *    （真实抓包：10205/15028 空响应均为 8B `0000000000000000`；补零成 28B 全零会被
 *    客户端判 MsgBodyExists=False 拒读，主界面初始化静默卡死 —— 2026-08-24 实证）；
 *  - 内部 protobuf ≤ 2B → tiny，补零到 28B（仅 error-only 短包如 `\x08\x00`，参考网关
 *    对 10020/15018 用 _wrap_dynproto，数据包一律 _wrap_dynproto_long 不补零）；
 *  - 否则 → long，不补零（对齐真实服务端：10281=18B/15032=24B，绝不补零）。
 */
export function wrapDynProtoAuto(pbuf: Buffer): Buffer {
  if (pbuf.length === 0) {
    const empty = Buffer.allocUnsafe(8);
    empty.writeUInt32LE(0, 0);
    empty.writeUInt32LE(0, 4);
    return empty;
  }
  return wrapDynProto(pbuf, pbuf.length <= 2);
}
