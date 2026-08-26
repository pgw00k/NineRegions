/**
 * VerRoute.ts — 版本下发（GET /ver 与 /r 前缀兜底共用）。
 *
 * 实证结论：
 *  - HANDOFF §6.2：所有字段必须是「字符串」，port 给数字会被客户端 NRE；
 *  - 对齐 4010 服务 resp/ver.json（capture 实证）：cdn / cdnbak 都是
 *    http://127.0.0.1:4010/res/（客户端随后从 /res/ 拉补丁列表与资源包）；
 *  - 值来自 Config，可经环境变量 / .env 调整。
 */
import { Config } from '../../config/env';
import { HttpContext } from '../HttpContext';

export function verHandler(ctx: HttpContext): void {
  const body = {
    ver: Config.gameVer,
    cdn: Config.gameCdn,
    cdnbak: Config.gameCdn,
    host: Config.gameHost,
    port: String(Config.gamePort),
    phost: '',
    pport: '',
    newapp: '',
    notice: '',
    state: '0',
    tag: '',
    md5: '',
    supportver: '0.12.0',
    forceupdate: '0',
    packresetver: '',
  };
  ctx.json(body);
}
