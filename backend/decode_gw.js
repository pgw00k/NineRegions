/**
 * 解码帧记录 jsonl 的 S2C 帧：提取 order + msgId 序列（按连接分组）。
 * S2C 帧结构: [bodyLen u32 LE][order u32 LE][msgId u16 LE][body]
 */
const fs = require('fs');
const path = require('path');

const file = process.argv[2] || './logs/gw_20260823.jsonl';
const raw = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);

const byConn = {};
for (const line of raw) {
  let o;
  try { o = JSON.parse(line); } catch { continue; }
  const conn = o.conn || '?';
  (byConn[conn] = byConn[conn] || []).push(o);
}

for (const conn of Object.keys(byConn)) {
  console.log(`\n===== conn=${conn} (${byConn[conn].length} frames) =====`);
  let prevOrder = null;
  for (const o of byConn[conn]) {
    if (o.dir !== 'S2C') {
      // C2S 记录（加密体，仅显示长度）以便对照时间线
      console.log(`  ${o.ts}  C2S  len=${o.len}`);
      continue;
    }
    const hex = o.hex || '';
    const b = Buffer.from(hex, 'hex');
    if (b.length < 10) { console.log(`  ${o.ts}  S2C  (too short ${b.length}) ${hex}`); continue; }
    const bodyLen = b.readUInt32LE(0);
    const order = b.readUInt32LE(4);
    const msgId = b.readUInt16LE(8);
    const gap = (prevOrder === null) ? '-' : (order - prevOrder);
    const flag = (prevOrder !== null && gap !== 1 && gap !== 0) ? '  <-- GAP' : '';
    console.log(`  ${o.ts}  S2C  order=${order} msgId=${msgId} bodyLen=${bodyLen} (Δ${gap})${flag}`);
    prevOrder = order;
  }
}
