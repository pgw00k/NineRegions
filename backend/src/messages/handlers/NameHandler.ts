/**
 * NameHandler.ts — 设置玩家名（10047 → 10048）。
 *
 * lua 实证（NetMsg_SetPlayerNameReq）：SetPlayerNameResponse.error==0 →
 * AccountDataMgr.SyncGenderAndName(gender, name) → Eventer.Fire("Guide_SetPlayerName")
 * → 引导(PVEMap0_1) 完成，进入主界面。Response 字段：
 *   #1 error #2 name #3 gender #4 headPic #5 personalInfo。
 *
 * C2S body 为 NetBitStream 前缀 + 内嵌 protobuf（SetPlayerNameRequest: #1 name #2 gender）；
 * 这里容错提取 name（protobuf 字段1 string，`0a <len> <utf8>` 模式），失败回退默认名。
 */
import { Buffer } from 'buffer';
import { MessageHandler, HandlerContext, S2CFrame, buildResponseFrame } from '../types';

/** 起名请求/应答消息号。 */
export const SET_PLAYERNAME_REQ = 10047;

/** 从 body 容错提取 protobuf string 字段（tag=0x0a 字段1）。返回字符串或 null。 */
function extractProtoString(body: Buffer, tag: number): string | null {
  for (let i = 0; i < body.length - 2; i++) {
    if (body[i] === tag) {
      const len = body[i + 1];
      if (len > 0 && i + 2 + len <= body.length) {
        const s = body.subarray(i + 2, i + 2 + len).toString('utf-8');
        if (/^[\x20-\x7e\u4e00-\u9fff]+$/.test(s)) return s;
      }
    }
  }
  return null;
}

export class NameHandler extends MessageHandler {
  match(ctx: HandlerContext): boolean {
    return ctx.msgId === SET_PLAYERNAME_REQ;
  }

  handle(ctx: HandlerContext): S2CFrame[] {
    try {
      const name = extractProtoString(ctx.body, 0x0a) || 'player1';
      // gender: 尝试字段2 varint（tag=0x10）；取不到默认 0
      let gender = 0;
      for (let i = 0; i < ctx.body.length - 1; i++) {
        if (ctx.body[i] === 0x10) {
          gender = ctx.body[i + 1] & 0xff;
          break;
        }
      }
      const s = ctx.services.schema.getByShortName('SetPlayerNameResponse');
      if (!s) return [];
      const inner = ctx.services.encoder.encode(s, {
        1: 0, // error=SUCCESS
        2: name,
        3: gender,
      });
      ctx.services.users.setHasName(ctx.connId);
      ctx.services.pve.markPushed(ctx.connId); // 起名成功 → 结算状态机收尾
      ctx.services.logger.info('name', `[${ctx.connId}] 设置玩家名成功: "${name}" gender=${gender} → Guide_SetPlayerName`);
      return [buildResponseFrame(ctx, inner)];
    } catch (e) {
      ctx.services.logger.error('name', `10048 构造失败: ${(e as Error).message}`);
      return [];
    }
  }
}
