/**
 * 战斗房间快照的落盘存储（文件版）。
 *
 * 为什么用文件而不是数据库：本项目已有 TypeORM/Postgres（账号、卡组、卡牌），
 * 但战斗房间是**进程级瞬态**数据，只有「本机调试时重启服务端还能续战」这一个用途。
 * 落库要为一张大 JSON 字段建实体/迁移，收益不抵成本；文件方案零 schema、可读可删，
 * 出问题直接删目录即可回到「无房间」状态。
 *
 * 写入用「临时文件 + rename」：进程被强杀时不会留下半截 JSON。
 */
import * as fs from 'fs';
import * as path from 'path';
import { Config, PROJECT_ROOT } from '../config/env';
import { Logger } from '../core/Logger';
import { BattleSnapshotFile, SNAPSHOT_VERSION } from './BattleSnapshot';

export class BattleSnapshotStore {

    private static get Dir(): string {
        return path.resolve(PROJECT_ROOT, Config.battleSnapshotDir);
    }

    /** roomToken 可能来自外部，落盘前收敛成安全文件名 */
    private static FileName(roomToken: string): string {
        return `${String(roomToken).replace(/[^\w.-]/g, '_')}.json`;
    }

    public static Save(snapshot: BattleSnapshotFile): void {
        try {
            fs.mkdirSync(this.Dir, { recursive: true });
            const file = path.join(this.Dir, this.FileName(snapshot.roomToken));
            const tmp = `${file}.tmp`;
            fs.writeFileSync(tmp, JSON.stringify(snapshot));
            fs.renameSync(tmp, file);
        } catch (err) {
            /** 落盘失败只影响「重启后续战」，不能打断正在进行的战斗 */
            Logger.LogError(`BattleSnapshotStore 保存快照失败 room=${snapshot.roomToken}`, err);
        }
    }

    /**
     * 读取全部可用快照（按 TTL 与版本号过滤）。
     * 单个文件解析失败不影响其它房间，故逐文件 try/catch。
     */
    public static LoadAll(): BattleSnapshotFile[] {
        let files: string[] = [];
        try {
            files = fs.readdirSync(this.Dir).filter((f) => f.endsWith('.json'));
        } catch {
            return [];
        }

        let out: BattleSnapshotFile[] = [];
        let now = Date.now();
        for (let f of files) {
            let full = path.join(this.Dir, f);
            try {
                let snap = JSON.parse(fs.readFileSync(full, 'utf-8')) as BattleSnapshotFile;
                if (snap.version !== SNAPSHOT_VERSION) {
                    Logger.LogWarn(`BattleSnapshotStore 跳过旧版本快照 ${f} version=${snap.version}`);
                    fs.unlinkSync(full);
                    continue;
                }
                if (now - snap.savedAt > Config.battleSnapshotTtlMinutes * 60_000) {
                    Logger.LogInfo(`BattleSnapshotStore 快照已过期，丢弃 ${snap.roomToken}（${Math.round((now - snap.savedAt) / 1000)}s 前）`);
                    fs.unlinkSync(full);
                    continue;
                }
                out.push(snap);
            } catch (err) {
                Logger.LogError(`BattleSnapshotStore 读取快照失败 ${f}`, err);
            }
        }
        return out;
    }

    /** 战斗已结算（或房间已作废）时清除，避免下次启动把玩家拖回已结束的战斗 */
    public static Delete(roomToken: string): void {
        try {
            fs.unlinkSync(path.join(this.Dir, this.FileName(roomToken)));
        } catch {
            /** 文件不存在即目标状态，无需处理 */
        }
    }
}
