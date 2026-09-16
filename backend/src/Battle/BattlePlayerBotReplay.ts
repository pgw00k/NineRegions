import { ActionType, BattleFieldSimple, CardSimple_2, DeployActionSimple, MESSAGE_ID } from "mc-local-share";
import { Logger } from "../core/Logger";
import { BattleHero } from "./BattleHero";
import { BattleConst } from "./BattleConst";
import { BattlePlayerBot } from "./BattlePlayerBot";

/**
 * 回放数据 —— 机器人「模拟真人提交操作」时依据的脚本。
 *
 * 这些结构直接对应 JYLog_Backup 中一场真实对局的 C2S 记录：
 *   - ChangeCardUids ：C2S 25003 换掉的手牌 uid（空数组表示不换牌）
 *   - DeployPlans    ：每轮 C2S 25006 的布阵动作（DeployActionSimple[]）
 *
 * 注意：uid 由服务端按 `side * 1000 + index + 1` 生成，因此回放脚本里的 uid
 * 必须落在机器人自己的 side 区间内（默认 side=2 → 2001 起）。
 */
export interface BotReplayScript {
    /** C2S 25003 换牌请求：要换掉的手牌 uid 列表 */
    ChangeCardUids: number[];
    /** 每轮 C2S 25006 布阵动作；索引 0 对应第一轮 */
    DeployPlans: DeployActionSimple[][];
    /** 是否快速战斗（C2S 25003 quickBattle 字段） */
    QuickBattle: boolean;
}

/**
 * 构建一套默认回放脚本。
 *
 * 不依赖外部文件：按「每轮把手上第 N 张牌依次上场」的贪心策略自动排布，
 * 足以驱动完整的 25003 → 25006 → 25012 循环，让真人客户端一路测到 25008。
 *
 * @param side 机器人阵营（决定手牌 uid 区间，默认 2 → 2001 起）
 * @param rounds 需要回放的轮数
 * @param handCount 每轮起手可用手牌数量（默认 6：5 起手 + 1 回合抽牌）
 */
export function BuildDefaultReplayScript(side: number = 2, rounds: number = 10, handCount: number = 6): BotReplayScript {
    let base = side * 1000;
    let plans: DeployActionSimple[][] = [];

    for (let r = 0; r < rounds; r++) {
        /**
         * 每轮最多上 3 张（战场 3 格）。
         *
         * uid 按 `r * 3 + slot` 在 handCount 内**连续递增且不重复**：
         * 一旦某张牌被 ApplyDeploy 从手牌移到场上，后续轮次就不会再引用它，
         * 避免「重复引用已打出的牌」导致布阵动作被静默丢弃。
         * handCount 取 6（5 起手 + 首轮抽 1）时，前两轮的 6 张牌正好用满。
         */
        let action: DeployActionSimple[] = [];
        for (let slot = 0; slot < 3; slot++) {
            let offset = (r * 3 + slot) % handCount;
            action.push({
                type: ActionType.PUT,
                index: slot,
                cardUid: base + offset + 1,
                field: { side: side, index: slot },
            });
        }
        plans.push(action);
    }

    return {
        ChangeCardUids: [],
        DeployPlans: plans,
        QuickBattle: false,
    };
}

/**
 * 机器人「回放模式」玩家。
 *
 * 继承 BattlePlayerBot（因此 SendMessage 仍是空实现，不会真的发网络包），
 * 在其之上补齐「模拟真人的 C2S 提交行为」：
 *
 *   C2S 25003 CHANGE_CARD_REQ        → 机器人自动换牌
 *   C2S 25006 DEPLOYMENT_COMPLETE_REQ → 每轮自动布阵提交
 *   C2S 25012 SHOW_END_REQ            → 播完表现后自动请求推进
 *
 * 三者都由「服务端下发的事件」触发（见 OnDealStep / OnDeploymentStart / OnFightStep），
 * 由 BattleBotRoom 在对应阶段调用，从而与真人客户端的节奏一致。
 */
export class BattlePlayerBotReplay extends BattlePlayerBot {

    /**
     * 机器人虚拟手牌/牌库的张数。
     * 必须 >= 每轮上场张数，且与 BuildDefaultReplayScript 的取模基数保持一致。
     */
    public static HandSize: number = 40;

    /** 机器人主将 ID（走本地虚拟数据，不查库） */
    public static HeroID: number = 1;

    /** 机器人主将技能 ID */
    public static HeroSkillID: number = 100001;

    /** 机器人播完表现后、发出 25012 前的等待时长（毫秒） */
    public static ShowEndDelayMs: number = 0;

    /** 回放脚本 */
    public Script: BotReplayScript;

    /** 提交给房间回调（由 BattleBotRoom 注入） */
    public OnSubmitDeploy?: (uid: string, action: DeployActionSimple[]) => void;

    /** 提交给房间回调（由 BattleBotRoom 注入） */
    public OnSubmitShowEnd?: (uid: string) => void;

    /** 当前回放到的轮次索引（从 0 开始） */
    protected ReplayRound: number = 0;

    /** 本局机器人是否已完成开局换牌 */
    protected ChangeCardDone: boolean = false;

    /** 本轮是否已提交布阵，避免重复提交 */
    protected DeploySubmitted: boolean = false;

    constructor(preset?: any) {
        super(preset);

        /**
         * 允许外部通过 preset.Script 注入自定义回放脚本；
         * 未提供则使用默认贪心脚本。
         */
        this.Script = preset?.Script ?? BuildDefaultReplayScript(preset?.side ?? 2);
    }

    /**
     * 覆盖基类的玩家信息读库逻辑。
     *
     * 基类构造函数会调用 InitPlayerInfo → PlayerService/PlayerInfoService，
     * 在无数据库（或服务未初始化）场景下会直接抛错。回放机器人不需要真实玩家资料，
     * 直接使用基类默认值即可（名称「无名少侠」、段位 1/0、功勋 0）。
     */
    override async InitPlayerInfo(): Promise<void> {
        this.name = `回放机器人${this.uid}`;
    }

    /**
     * 触发时机：服务端下发 S2C 25010 DEAL_STEP_REP（抽牌步骤）。
     *
     * 日志实证：25010 与 25005 成对出现，25004 只在开局出现一次。
     * 因此「开局换牌」挂在这里 —— 用首次 DealStep 作为开局标志。
     */
    OnDealStep(): void {
        if (this.ChangeCardDone) {
            return;
        }
        this.ChangeCardDone = true;
        this.ReplayChangeCard();
    }

    /**
     * 触发时机：服务端下发 S2C 25005 DEPLOYMENT_START_REP（部署开始）。
     *
     * 此时进入布阵阶段，机器人模拟真人提交 C2S 25006。
     */
    OnDeploymentStart(): void {
        this.DeploySubmitted = false;
        this.ReplayDeploy();
    }

    /**
     * 触发时机：服务端下发 S2C 25011 FIGHT_STEP_REP（战斗表现）。
     *
     * 真人客户端播完表现后会发 C2S 25012；机器人同样延迟一小段时间再发，
     * 以贴近真人的「播放中」节奏，避免抢在真人前面推进。
     */
    OnFightStep(): void {
        setTimeout(() => {
            this.ReplayShowEnd();
        }, BattlePlayerBotReplay.ShowEndDelayMs);
    }

    /**
     * 模拟 C2S 25003 CHANGE_CARD_REQ。
     *
     * 直接复用 BattlePlayer.ChangeCard 的换牌结算（把手牌塞回牌库再抽等量张）。
     */
    protected ReplayChangeCard(): void {
        let req = {
            cardUids: this.Script.ChangeCardUids ?? [],
            quickBattle: this.Script.QuickBattle ?? false,
        };
        this.ChangeCard(req);
        Logger.LogInfo(`[BotReplay ${this.uid}] 模拟 C2S 25003 换牌 uids=${req.cardUids.length}`);
    }

    /**
     * 模拟 C2S 25006 DEPLOYMENT_COMPLETE_REQ。
     *
     * 取脚本中本轮对应的布阵动作，交给房间的 DeploymentComplete 处理。
     */
    protected ReplayDeploy(): void {
        if (this.DeploySubmitted) {
            return;
        }
        this.DeploySubmitted = true;

        let action = this.Script.DeployPlans[this.ReplayRound] ?? [];
        Logger.LogInfo(`[BotReplay ${this.uid}] 模拟 C2S 25006 布阵 round=${this.ReplayRound} actions=${action.length}`);

        if (this.OnSubmitDeploy) {
            this.OnSubmitDeploy(this.uid, action);
        }
    }

    /**
     * 模拟 C2S 25012 SHOW_END_REQ，并推进机器人自身的回放轮次。
     */
    protected ReplayShowEnd(): void {
        Logger.LogInfo(`[BotReplay ${this.uid}] 模拟 C2S 25012 播完 round=${this.ReplayRound}`);

        /** 先推进本地轮次，下一轮布阵才能取到对应脚本 */
        this.ReplayRound++;

        if (this.OnSubmitShowEnd) {
            this.OnSubmitShowEnd(this.uid);
        }
    }
}
