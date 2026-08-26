/**
 * LoginRoute.ts — POST /login 登录应答。
 *
 * 实证结论（HANDOFF §6.3，已写入 HttpServer 原注释）：
 *  - /login 是 JSON 不是 protobuf，客户端 JsonConvert 只吃 JSON；
 *  - 同时返回驼峰与帕斯卡大小写变体字段，防 NRE。
 */
import { Config } from '../../config/env';
import { HttpContext } from '../HttpContext';

const UID = '76561198124119613';
const TOKEN = 'localtoken123';

export async function loginHandler(ctx: HttpContext): Promise<void> {
  // 读取并丢弃请求体（正式流程会带账号密码，本地 mock 无需校验）
  await ctx.readBody();

  const resp = {
    error: 0,
    index: '0',
    token: TOKEN,
    host: Config.gameHost,
    port: String(Config.gamePort),
    Error: 0,
    Index: '0',
    Token: TOKEN,
    Host: Config.gameHost,
    Port: String(Config.gamePort),
    uid: UID,
    userid: UID,
    session: TOKEN,
  };
  ctx.json(resp);
}
