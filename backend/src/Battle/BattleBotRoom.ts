import { DeployActionSimple } from "mc-local-share";
import { Logger } from "../core/Logger";
import { BattlePlayerBotReplay, BotReplayScript } from "./BattlePlayerBotReplay";
import { BattleRoom } from "./BattleRoom";

/**
 * 用来模拟行为的对战房间（人机）。
 *
 * 与 BattleRoom 的唯一差异是「自动补一个机器人」：机器人由 BattlePlayerBotReplay
 * 驱动，会按回放脚本模拟真人的 C2S 提交（25003 换牌 / 25006 布阵 / 25012 播完），
 * 从而让真人客户端能够一路推进到 25008 战斗结束。
 */
export class BattleBotRoom extends BattleRoom {

    /** 本房间的机器人（回放模式） */
    public Bot?: BattlePlayerBotReplay;

    constructor(preset: any) {
        super(preset);

        // 自动新增一个机器人
        // 这里我在数据库默认创建了一个玩家ID=1和Deck=1
        this.SetBattler({ did: 1, client: undefined, uid: 1 }, BattlePlayerBotReplay);

        /**
         * SetBattler 内部同步 new 出实例，这里取回引用并注入「提交回调」。
         * 机器人不能直接调用房间方法（会与真人请求竞争），统一走回调，
         * 由房间决定何时真正执行 DeploymentComplete / ShowEnd。
         */
        let bot: unknown = this.BattlersDict['1'];
        if (bot instanceof BattlePlayerBotReplay) {
            this.Bot = bot;
            bot.OnSubmitDeploy = (uid, action) => this.OnBotDeploy(uid, action);
            bot.OnSubmitShowEnd = (uid) => this.OnBotShowEnd(uid);
        } else {
            Logger.LogWarn(`BattleBotRoom[${this.RoomToken}] 机器人类型异常：${(bot as any)?.constructor?.name}`);
        }
    }

    /**
     * 机器人提交布阵（等价于收到机器人发来的 C2S 25006）。
     *
     * 延迟一拍执行，避免「机器人在 25005 广播途中立刻提交」导致
     * 双人同时布阵完成、绕过真人的布阵阶段。
     */
    protected OnBotDeploy(uid: string, action: DeployActionSimple[]) {
        setTimeout(() => {
            this.DeploymentComplete(uid, { action: action });
        }, BattleBotRoom.BotDeployDelayMs);
    }

    /**
     * 机器人播完表现（等价于收到机器人发来的 C2S 25012）。
     *
     * 同样延迟执行，把推进权优先让给真人客户端 —— 若真人在此之前已发 25012，
     * ShowEnd 内部的 BattleEnded / 状态判断会自然兜住，不会重复推进。
     */
    protected OnBotShowEnd(uid: string) {
        setTimeout(() => {
            this.ShowEnd(uid);
        }, BattleBotRoom.BotShowEndDelayMs);
    }

    /**
     * 机器人提交布阵的延迟（毫秒）。
     * 必须 > 0：给真人留出「收到 25005 → 操作 → 发 25006」的时间窗。
     */
    public static BotDeployDelayMs: number = 3000;

    /** 机器人播完表现的延迟（毫秒） */
    public static BotShowEndDelayMs: number = 2000;
}
