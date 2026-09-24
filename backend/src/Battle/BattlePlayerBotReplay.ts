import { ActionType, BattleFieldSimple, CardSimple_2, DeployActionSimple, MESSAGE_ID } from "mc-local-share";
import { Logger } from "../core/Logger";
import { BattleHero } from "./BattleHero";
import { BattleConst } from "./BattleConst";
import { BattlePlayerBot } from "./BattlePlayerBot";
import { RegisterBattleClasses } from "./BattleSnapshot";

/**
 * 回放数据 —— 机器人「模拟真人提交操作」时依据的脚本。
 *
 * 这些结构直接对应 JYLog_Backup 中一场真实对局的 C2S 记录：
 *   - ChangeCardCount：C2S 25003 换掉的手牌数量（换哪些由机器人从手牌自选）
 *   - DeployPerRound ：每轮 C2S 25006 布阵要上场的牌数
 *   - QuickBattle    ：C2S 25003 quickBattle 字段
 */
export interface BotReplayScript {
    /** C2S 25003 换牌请求：换掉的手牌数量 */
    ChangeCardCount: number;
    /** 每轮 C2S 25006 布阵上场张数；索引 0 对应第一轮 */
    DeployPerRound: number[];
    /** 是否快速战斗（C2S 25003 quickBattle 字段） */
    QuickBattle: boolean;
}

/**
 * 构建一套默认回放脚本。
 *
 * 机器人不再维护「虚拟手牌」，而是直接沿用数据库初始化后的真实手牌：
 *   - 换牌：拿 ChangeCardCount 张当前手牌去换
 *   - 布阵：每轮把 DeployPerRound[N] 张当前手牌依次上场到空地块
 *
 * 这样无需关心 uid 区间（side*1000+index+1 由 InitBattleInfo 生成），
 * 布阵动作里的 cardUid 全部取自 this.HandIDs，天然落在自己的手牌区间内。
 */
export function BuildDefaultReplayScript(rounds: number = 10, deployPerRound: number = 2): BotReplayScript {
    return {
        ChangeCardCount: 0,
        DeployPerRound: new Array(rounds).fill(deployPerRound),
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
         * 未提供则使用默认脚本（见 BuildDefaultReplayScript）。
         */
        this.Script = preset?.Script ?? BuildDefaultReplayScript();
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
     * 换的牌从当前真实手牌中取出前 ChangeCardCount 张。
     */
    protected ReplayChangeCard(): void {
        let count = this.Script.ChangeCardCount ?? 0;
        let cardUids = this.HandUIDs.slice(0, count);
        let req = {
            cardUids: cardUids,
            quickBattle: this.Script.QuickBattle ?? false,
        };
        this.ChangeCard(req);
        Logger.LogInfo(`[BotReplay ${this.uid}] 模拟 C2S 25003 换牌 uids=${cardUids.length}`);
    }

    /**
     * 模拟 C2S 25006 DEPLOYMENT_COMPLETE_REQ。
     *
     * 从当前真实手牌中取本轮应上场的牌，放入战场上的空地块，
     * 构造本轮布阵动作后交给房间的 DeploymentComplete 处理。
     *
     * 直接沿用数据库初始化后的真实手牌/战场（BattlePlayer.HandIDs/BattleFields），
     * 不再依赖任何虚拟/静态 uid。
     */
    protected ReplayDeploy(): void {
        if (this.DeploySubmitted) {
            return;
        }
        this.DeploySubmitted = true;

        let want = this.Script.DeployPerRound[this.ReplayRound] ?? 0;

        let action: DeployActionSimple[] = [];
        let slot = 0;
        let placed = 0;
        for (const cardUid of this.HandUIDs) {
            if (placed >= want) {
                break;
            }
            /**
             * 法术牌不占战场格位，若把它当单位 PUT 上去会造成「占用了格位但无实体」、
             * 进而引发格位错位/重叠（问题1）。这里直接跳过，只让单位牌上场。
             */
            if (this.AllCards[cardUid].IsMagic) {
                continue;
            }
            while (slot < BattleConst.FIELD_SIZE && this.BattleFields[slot].hasCard) {
                slot++;
            }
            if (slot >= BattleConst.FIELD_SIZE) {
                // 场上已无空地块，本轮不再上场
                break;
            }
            action.push({
                type: ActionType.PUT,
                index: slot,
                cardUid: cardUid,
                field: { side: this.side, index: slot },
            });
            slot++;
            placed++;
        }

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

RegisterBattleClasses({ BattlePlayerBot, BattlePlayerBotReplay });
