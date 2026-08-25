/**
 * C2SCrypto.ts — C2S 密文解密（脱离 Frida 的关键）。
 *
 * 加密链（2026-08-24 实证，20/20 帧恢复成功）：
 *   EncodeBuffer 输入 = plain ^ keybe循环（keybe = key 的大端 4 字节，由 IFix 补丁代码预做外层 XOR）
 *   EncodeBuffer(key, add=1)：K = key + C2S_HASH；dl = K&0xFF；
 *     buf[i] ^= T1[(K+i)&0x3FF]；buf[i] = T2[buf[i]] - dl
 *   WS 密文 = EncodeBuffer(plain ^ keybe循环) ^ keybe循环
 * 即：ws = Encode(plain^keybe) ^ keybe  →  plain = Decode(ws^keybe) ^ keybe
 *
 * 服务端恢复 key（每帧随机，32 位）：
 *   扫 bodyLen(2..72) × K&0x3FF(1024)，由前 4 字节方程逐字节解 keybe 组合，
 *   自洽检查 ((key+hash)&0x3FF)==K10 + 全帧验证（bodyLen 自洽 / msgId 合法 / pad 区全零）。
 */
import { Buffer } from 'buffer';
import { C2S_HASH, C2S_T1, C2S_T2INV } from './c2s_tables';

/** 已知消息号白名单（防解密误报：错误 key 解出的随机 msgId 直接拒绝）。 */
const KNOWN_MSG_IDS = new Set<number>([
  1, 7,
  9050, 9051,
  10001, 10003, 10004, 10011, 10012, 10019, 10020, 10047, 10048, 10050,
  10204, 10205, 10280, 10281,
  15017, 15018, 15027, 15028, 15031, 15032, 15040, 15041,
  20001, 20002,
  25001, 25002, 25003, 25004, 25006, 25007, 25009, 25012, 25014,
]);

export interface DecodedC2S {
  msgId: number;
  order: number;
  body: Buffer;
}

function keybe(key: number): number[] {
  const u = key >>> 0;
  return [(u >>> 24) & 0xff, (u >>> 16) & 0xff, (u >>> 8) & 0xff, u & 0xff];
}

/** 完整解密: plain = Decode(ws ^ keybe, key) ^ keybe。 */
export function fullDecryptC2S(ws: Buffer, key: number): Buffer {
  const K = (key + C2S_HASH) >>> 0;
  const dl = K & 0xff;
  const kb = keybe(key);
  const n = ws.length;
  const mid = Buffer.allocUnsafe(n);
  for (let i = 0; i < n; i++) {
    mid[i] = C2S_T2INV[((ws[i] ^ kb[i & 3]) + dl) & 0xff];
  }
  const out = Buffer.allocUnsafe(n);
  for (let i = 0; i < n; i++) {
    out[i] = (mid[i] ^ C2S_T1[(K + i) & 0x3ff]) ^ kb[i & 3];
  }
  return out;
}

/** 从 WS 密文恢复 key 并解密。失败返回 null。 */
export function decryptC2S(ws: Buffer): DecodedC2S | null {
  const n = ws.length;
  if (n < 12) return null;
  // 快速路径: 假设 bodyLen < 256 (绝大多数消息; 264B 帧 bodyLen=205 已覆盖)
  const r = tryDecrypt(ws, true);
  if (r) return r;
  // 兜底: bodyLen ≥ 256 的极端帧
  return tryDecrypt(ws, false);
}

/**
 * 解密核心:
 *  - fast=true: 假设 bodyLen<256 → 明文[1..3]=0, 先解 key 高 24 位(不依赖 bodyLen), 再扫 kb[0] 验证
 *  - fast=false: 全扫 bodyLen 2..n-8
 */
function tryDecrypt(ws: Buffer, fast: boolean): DecodedC2S | null {
  const n = ws.length;
  const maxBl = n - 8;
  if (fast) {
    for (let K10 = 0; K10 < 1024; K10++) {
      const dl = K10 & 0xff;
      const s1: number[] = [];
      const s2: number[] = [];
      const s3: number[] = [];
      for (let c = 0; c < 256; c++) {
        if ((C2S_T2INV[((ws[1] ^ c) + dl) & 0xff] ^ c) === C2S_T1[(K10 + 1) & 0x3ff]) s1.push(c);
        if ((C2S_T2INV[((ws[2] ^ c) + dl) & 0xff] ^ c) === C2S_T1[(K10 + 2) & 0x3ff]) s2.push(c);
        if ((C2S_T2INV[((ws[3] ^ c) + dl) & 0xff] ^ c) === C2S_T1[(K10 + 3) & 0x3ff]) s3.push(c);
      }
      if (!s1.length || !s2.length || !s3.length) continue;
      for (const b of s1) {
        for (const c of s2) {
          for (const d of s3) {
            const hi24 = ((b << 16) | (c << 8) | d) >>> 0;
            for (let a = 0; a < 256; a++) {
              const key = ((a << 24) | hi24) >>> 0;
              if ((((key + C2S_HASH) >>> 0) & 0x3ff) !== K10) continue;
              const plain = fullDecryptC2S(ws, key);
              const bl = plain.readUInt32LE(0);
              if (bl < 2 || bl > maxBl) continue;
              const valid = 10 + (bl - 2);
              if (valid > n) continue;
              // 防误报: pad 区至少 8B 全零 + msgId 白名单
              if (n - valid < 8) continue;
              if (!padZero(plain, valid)) continue;
              const msgId = plain.readUInt16LE(8);
              if (!KNOWN_MSG_IDS.has(msgId)) continue;
              return { msgId, order: plain.readUInt32LE(4), body: plain.subarray(10, valid) };
            }
          }
        }
      }
    }
    return null;
  }
  // 全扫 bodyLen（fast 失败时兜底；bl≥256 场景 pb[1]≠0）
  const orderBl: number[] = [];
  for (let bl = 2; bl <= maxBl; bl++) orderBl.push(bl);
  orderBl.sort((a, b) => {
    const pa = a === 21 || a === 48 ? 0 : 1;
    const pb = b === 21 || b === 48 ? 0 : 1;
    return pa - pb;
  });
  for (const bl of orderBl) {
    const pb0 = bl & 0xff;
    const pb1 = (bl >> 8) & 0xff;
    for (let K10 = 0; K10 < 1024; K10++) {
      const dl = K10 & 0xff;
      const sols: number[][] = [[], [], [], []];
      let allOk = true;
      for (let i = 0; i < 4; i++) {
        const t1v = C2S_T1[(K10 + i) & 0x3ff];
        const wb = ws[i];
        const pb = i === 0 ? pb0 : i === 1 ? pb1 : 0;
        const ss = sols[i];
        for (let c = 0; c < 256; c++) {
          if ((C2S_T2INV[((wb ^ c) + dl) & 0xff] ^ c ^ pb) === t1v) ss.push(c);
        }
        if (ss.length === 0) {
          allOk = false;
          break;
        }
      }
      if (!allOk) continue;
      const [s0, s1, s2, s3] = sols;
      for (const a of s0) {
        for (const b of s1) {
          for (const c of s2) {
            for (const d of s3) {
              const key = ((a << 24) | (b << 16) | (c << 8) | d) >>> 0;
              if ((((key + C2S_HASH) >>> 0) & 0x3ff) !== K10) continue;
              const plain = fullDecryptC2S(ws, key);
              if (plain.readUInt32LE(0) !== bl) continue;
              const valid = 10 + (bl - 2);
              if (n - valid < 8) continue;
              if (!padZero(plain, valid)) continue;
              const msgId = plain.readUInt16LE(8);
              if (!KNOWN_MSG_IDS.has(msgId)) continue;
              return { msgId, order: plain.readUInt32LE(4), body: plain.subarray(10, valid) };
            }
          }
        }
      }
    }
  }
  return null;
}

function padZero(plain: Buffer, valid: number): boolean {
  for (let i = valid; i < plain.length; i++) {
    if (plain[i] !== 0) return false;
  }
  return true;
}
