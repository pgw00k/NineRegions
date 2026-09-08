/**
 * types.ts — 消息链路最小类型契约。
 *
 * 核心链路（解密 → 路由 → Auto 处理 → 编码）仅需一条 S2C 帧的载体定义，
 * 其余旧链路的上下文/注册表/静态编解码依赖已全部移除。
 */
import { Buffer } from 'buffer';

/** 一条要下发给客户端的 S2C 帧。 */
export interface S2CFrame {
  /** 应答消息号（recId）。 */
  msgId: number;
  /** 应答 order（沿用 C2S 的 order）。 */
  order: number;
  /** 已按线格式构造好的帧体（含 dynproto 头）。 */
  body: Buffer;
}

export interface C2SFrameHeader{
  /** 帧体（含 dynproto 头）大小（字节）。u32 */
  size: number;
  /** 帧 order（沿用 C2S 的 order）。u32 */
  order: number;
  /** 帧消息号（recId）。u16 */
  msgId: number;
}

export interface Envelope{
  /** 信封中的用户 ID（ASCII 数字串，解包时已校验） */
  /** 长度限制u16 */
  uid: string;
  /** 信封中的 token（可选：心跳等仅含 uid 的帧缺省） */
  /** 长度限制u16 */
  token?: string;
}

export interface DecodedC2S {
  /** 帧头 */
  header: C2SFrameHeader;
  /** 信封 */
  envelope: Envelope;
  body: Buffer;
}