/**
 * LoginRoute.ts — POST /login 登录应答。
 *
 * 实证结论（HANDOFF §6.3，已写入 HttpServer 原注释）：
 *  - /login 是 JSON 不是 protobuf，客户端 JsonConvert 只吃 JSON；
 *  - 同时返回驼峰与帕斯卡大小写变体字段，防 NRE。
 */
import { Config } from '../../config/env';
import { UserLibraryService } from '../../database/service/UserLibrary.service';
import { HttpContext } from '../HttpContext';

export async function loginHandler(ctx: HttpContext): Promise<void> {

  let body = await ctx.readForm();

  /**
   * 此处应当根据传入的 userid 进行验证，返回对应的 token、session、uid
   * uid 使用数据库真实玩家 ID（长度不要求固定，信封按 [u16 len][uid] 动态解析）。
   */
  let uid = body['userid'];
  let userLibrary = await UserLibraryService.Instance.GetBySdkID(uid);
  if (userLibrary && userLibrary.uid) {
    uid = String(userLibrary.uid);
  }
  const resp = {
    error: 0,
    index: '0',
    host: Config.gameHost,
    port: String(Config.gamePort),
    token: 'TOKEN-395085356',
    session: 'session-395085356',
    uid: uid,
  };
  ctx.json(resp);
}
