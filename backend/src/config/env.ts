/**
 * env.ts — 配置中心。
 *
 * 设计要点：
 *  - 零运行时依赖：自带极简 .env 解析（不引入 dotenv）。
 *  - 所有路径以「当前工作目录」(backend) 为基准，dist/src 与 src 两种运行方式都一致。
 *  - 每个配置项都有默认值，开箱即跑。
 */
import * as fs from 'fs';
import * as path from 'path';

/** 读取项目根目录（backend）下的 .env，覆盖到进程环境之前先合并。 */
function loadDotEnv(): Record<string, string> {
  const envPath = path.resolve(process.cwd(), '.env');
  const out: Record<string, string> = {};
  if (!fs.existsSync(envPath)) return out;
  const text = fs.readFileSync(envPath, 'utf-8');
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2];
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}

const dot = loadDotEnv();

function get(k: string, def: string): string {
  return process.env[k] ?? dot[k] ?? def;
}
function getNum(k: string, def: number): number {
  const v = get(k, String(def));
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}
function getBool(k: string, def: boolean): boolean {
  const v = get(k, def ? 'true' : 'false').toLowerCase();
  return v === '1' || v === 'true' || v === 'yes' || v === 'on';
}

/**
 * 全局配置对象。建议通过环境变量 / .env 注入，不要直接修改本对象。
 */
export const Config = {
  // 网络
  wsPort: getNum('WS_PORT', 8800),
  wsHost: get('WS_HOST', '0.0.0.0'),
  wsSubprotocol: get('WS_SUBPROTOCOL', 'xj'),
  plainUdpPort: getNum('PLAIN_UDP_PORT', 9002),
  plainUdpHost: get('PLAIN_UDP_HOST', '0.0.0.0'),
  httpPort: getNum('HTTP_PORT', 8080),
  httpHost: get('HTTP_HOST', '127.0.0.1'),

  // 协议源 / 生成产物（相对 backend 根）
  protocolDir: get('PROTOCOL_DIR', 'protocol/source'),
  registryPath: get('REGISTRY_PATH', 'src/proto/generated/message-registry.json'),
  packMsgPath: get('PACK_MSG_PATH', 'protocol/source/pack_msg'),
  mocksDir: get('MOCKS_DIR', 'src/mocks'),

  // HTTP /ver 回给客户端的服务器地址
  gameHost: get('GAME_HOST', '127.0.0.1'),
  gamePort: getNum('GAME_PORT', 8800),
  gameVer: get('GAME_VER', '0.12.786'),
  gameCdn: get('GAME_CDN', 'http://127.0.0.1:8080/res/'),

  // 存储后端
  storageDriver: get('STORAGE_DRIVER', 'memory'),
  redisUrl: get('REDIS_URL', 'redis://127.0.0.1:6379'),
  databaseUrl: get('DATABASE_URL', ''),

  // 日志
  logLevel: get('LOG_LEVEL', 'info'),
  logDir: get('LOG_DIR', 'logs'),
  recordFrames: getBool('RECORD_FRAMES', true),
};

/** 项目根目录（始终为 backend）。运行期统一从这里拼相对路径。 */
export const PROJECT_ROOT = path.resolve(process.cwd());

export const PROTOCOL_DIR_ABS = path.resolve(PROJECT_ROOT, Config.protocolDir);
export const REGISTRY_PATH_ABS = path.resolve(PROJECT_ROOT, Config.registryPath);
export const PACK_MSG_PATH_ABS = path.resolve(PROJECT_ROOT, Config.packMsgPath);
export const MOCKS_DIR_ABS = path.resolve(PROJECT_ROOT, Config.mocksDir);

export const LOG_DIR_ABS = path.resolve(PROJECT_ROOT, Config.logDir);
