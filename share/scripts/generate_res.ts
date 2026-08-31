/**
 * generate_res.ts — 由 LUA 下的 NetMsg_* 消息定义生成「消息配对元数据」JSON。
 *
 * 针对每个 NetMsg_*.lua，在 share/msg 目录下生成同名的 .json 文件，字段：
 *   - TageName      —— LUA 里声明的逻辑名（可能缺省）
 *   - reqId         —— 请求消息号（字符串，取 MESSAGE_ID 名，如 "ENTER_GAME_REQ"）
 *   - reqProto      —— 请求 proto 类型短名（如 "EnterGameRequest"）
 *   - recId         —— 响应消息号（字符串）
 *   - recvProto     —— 响应 proto 类型短名（如 "EnterGameResponse"）
 *   - needParseLua  —— 是否需要 generate_ts 据此生成后端处理器（带合法请求号的为 true）
 *
 * 定位：仅生成 JSON，不直接生成 backend TS；TS 由 generate_ts 依据本 JSON 生成。
 *
 * 用法：
 *   npx tsx scripts/generate_res.ts [LuaDir] [outDir]
 *   env 覆盖：LUA_DIR、RES_JSON_OUT_DIR
 *   缺省 LuaDir = <repo>/LUA，outDir = <repo>/share/msg
 */
import * as fs from 'fs';
import * as path from 'path';
import { Meta, collectNetMessages } from './luaMeta';

/** 取 MESSAGE_ID.XXX 中的 XXX；无名字引用则返回空串。 */
function idName(id: Meta['reqId']): string {
  const mm = /^MESSAGE_ID\.(.+)$/.exec(id.enumExpr);
  return mm ? mm[1] : '';
}

/** 是否需要生成后端处理器：请求号合法（>0）才算一条完整请求对。 */
function needParse(meta: Meta): boolean {
  return meta.reqId.num > 0 && meta.reqProto !== '';
}

function toJson(fileName: string, meta: Meta): string {
  return JSON.stringify(
    {
      TageName: meta.tagName,
      reqId: idName(meta.reqId),
      reqProto: meta.reqProto,
      recId: idName(meta.recId),
      recvProto: meta.recvProto,
      needParseLua: needParse(meta),
    },
    null,
    2,
  );
}

function main(): void {
  const cwd = process.cwd();
  const root = path.resolve(cwd, '..');
  const luaDir = path.resolve(process.argv[2] || process.env.LUA_DIR || path.join(root, 'LUA'));
  const outDir = path.resolve(
    process.argv[3] || process.env.RES_JSON_OUT_DIR || path.join(root, 'share', 'msg'),
  );

  const netMsgDir = path.join(luaDir, 'NetMsg');
  if (!fs.existsSync(netMsgDir)) {
    console.error(`[gen-res] 找不到 NetMsg 目录: ${netMsgDir}`);
    process.exit(1);
  }

  fs.mkdirSync(outDir, { recursive: true });

  const nets = collectNetMessages(luaDir);
  let written = 0;
  let handled = 0;
  for (const { fileName, meta } of nets) {
    const base = fileName.replace(/\.lua$/, '');
    fs.writeFileSync(path.join(outDir, `${base}.json`), toJson(base, meta), 'utf-8');
    written++;
    if (needParse(meta)) handled++;
  }

  console.log(`[gen-res] 解析 NetMsg 文件: ${nets.length}`);
  console.log(`[gen-res] 输出 JSON: ${written}（需生成处理器: ${handled}）`);
  console.log(`[gen-res] Lua 目录: ${luaDir}`);
  console.log(`[gen-res] 输出目录: ${outDir}`);
}

if (require.main === module) {
  main();
}