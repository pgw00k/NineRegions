import { Action, BattleLogSimple, DeployActionSimple } from "mc-local-share";
import { Logger } from "../core/Logger";
import { BattleConst } from "./BattleConst";
import { BattlePlayer, SummonSpec } from "./BattlePlayer";
import { BattlePlayerBotReplay, BotReplayScript } from "./BattlePlayerBotReplay";
import { BattleRoom } from "./BattleRoom";
import { RegisterBattleClasses } from "./BattleSnapshot";
import { BattleUnit } from "./BattleUnit";

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

        this.LinkBot();
    }

    /**
     * 取回机器人实例引用并注入「提交回调」。
     *
     * 机器人不能直接调用房间方法（会与真人请求竞争），统一走回调，
     * 由房间决定何时真正执行 DeploymentComplete / ShowEnd。
     *
     * 抽成方法是因为有第二个调用点：快照恢复（AfterRestore）用 Object.create 重建对象，
     * 不跑构造函数，而这些回调是函数、不入快照，必须在这里重新注入。
     */
    private LinkBot(): void {
        let bot: unknown = this.BattlersDict['1'];
        if (bot instanceof BattlePlayerBotReplay) {
            this.Bot = bot;
            bot.OnSubmitDeploy = (uid, action) => this.OnBotDeploy(uid, action);
            bot.OnSubmitShowEnd = (uid) => this.OnBotShowEnd(uid);
        } else {
            Logger.LogWarn(`BattleBotRoom[${this.RoomToken}] 机器人类型异常：${(bot as any)?.constructor?.name}`);
        }
    }

    /** 【快照重建】派生字段 + 机器人回调都要补齐，再交给基类做通用恢复 */
    public AfterRestore(): void {
        super.AfterRestore();
        this.LinkBot();
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

    /**
     * 【测试】凭空召唤总开关。
     *
     * 真实主将技召唤已由「布阵落格 → 翻牌 → SpecialSummon」走通（25006 的 SKILL 动作驱动），
     * 开战/亡语的凭空注入只是验证表现链路用的模拟，默认关闭。
     * 置 true 可复用下面的 OnFightBegin / OnUnitKilled 做客户端表现回归。
     */
    public static EnableTestSummon: boolean = false;

    /**
     * 【测试】凭空召唤配置：英雄令新主(10154) 的战吼「召唤 1 名无名少侠(10152)」。
     *
     * 三个 ID 全部取自客户端真实配置表（Buffers/Cards/Skills 三表共用同一编号）：
     * Buffers[10010154].ActiveEffect = 7(SpecialSummon)，Parm2=10152，Parm3=1。
     * 客户端拿不到这三个 ID 中任意一个时会静默放弃召唤（不报错、不建实体）。
     */
    public static SummonDemo: SummonSpec = {
        skillId: 10010154,
        bufferId: 10010154,
        cid: 10152,
        cost: 2,
        atk: 1,
        def: 4,
        skillIdList: [10010152],
        passiveSkillIdList: [],
        count: 4,
    };

    /** 【测试】战斗开始时的一次性凭空召唤是否已注入（每局只跑一次） */
    private SummonOnFightBeginDone: boolean = false;

    /** 【测试】亡语式召唤是否已触发（每局只触发一次，避免召唤→阵亡→召唤死循环） */
    private SummonOnKilledDone: boolean = false;

    /**
     * 【测试·战斗开始即召唤】首轮战斗表现节点就绪后（逐格结算开始前），
     * 给真人玩家凭空召唤 4 个无名少侠。
     *
     * 走 ResolveSummon 原语：Skill 动作的 hit.bufferId 命中客户端 Buffers 表的
     * SpecialSummon(7)，客户端即用 hit.card 在建实体格上播「扣牌翻面」——
     * 全程不依赖部署/快照，与真实对局的战斗中途召唤同链路。
     * 4 个召唤物合成一条动作，客户端只播一次特写。
     */
    protected OnFightBegin(logs: BattleLogSimple[], actions: Action[]): void {
        if (!BattleBotRoom.EnableTestSummon || this.SummonOnFightBeginDone) {
            return;
        }
        this.SummonOnFightBeginDone = true;

        let human = this.GetHuman();
        if (!human) {
            Logger.LogWarn(`BattleBotRoom[${this.RoomToken}] 凭空召唤测试：未找到真人玩家`);
            return;
        }
        let caster = this.GetCasterIndex(human);
        let landed = this.ResolveSummon(human, caster, BattleBotRoom.SummonDemo, logs, actions);
        Logger.LogInfo(`BattleBotRoom[${this.RoomToken}] 测试·开战凭空召唤：cid=${BattleBotRoom.SummonDemo.cid} 施法格=${caster} 落格 ${landed}/4`);
    }

    /**
     * 【测试·亡语召唤】真人单位阵亡后立刻补召唤 1 个单位。
     * 验证「被消灭后召唤别的单位」这类事件驱动召唤：Skill/Born
     * 插入在该次死亡的 Dead 动作之后，客户端按序播放「死亡 → 召唤登场」。
     */
    protected OnUnitKilled(deadPlayer: BattlePlayer, unit: BattleUnit, logs: BattleLogSimple[], actions: Action[]): void {
        if (!BattleBotRoom.EnableTestSummon || this.SummonOnKilledDone) {
            return;
        }
        let human = this.GetHuman();
        if (!human || deadPlayer !== human) {
            return;
        }
        this.SummonOnKilledDone = true;
        /**
         * 施法者不能是刚阵亡的那一格：Dead 动作已把实体移除，客户端会以
         * 「AttackEntity on Pointer … is null」整条丢弃这个 Skill 动作（见 GetCasterIndex）。
         */
        let caster = this.GetCasterIndex(human);
        let landed = this.ResolveSummon(human, caster, { ...BattleBotRoom.SummonDemo, count: 1 }, logs, actions);
        Logger.LogInfo(`BattleBotRoom[${this.RoomToken}] 测试·亡语召唤：单位 uid=${unit.uid} 阵亡 → 补召唤施法格=${caster} 落格数=${landed}`);
    }

    /** 真人玩家（非机器人的参战者） */
    private GetHuman(): BattlePlayer | undefined {
        return this.Battlers.find((b) => b !== (this.Bot as unknown as BattlePlayer));
    }

    /**
     * 【测试】施法者格：真人本方第一块有实体的地块，全场无实体时退化到主将格 100。
     *
     * b1 不是可选的特效挂点，而是 Skill 表现的**硬前置**：
     * BattleMainSkillCast.DoExcecute(0x14A5400) 用 ClientAction.AttackerPointer(0x1439C50)
     * （即 action.b1）作为 attack 指针，迭代器 MoveNext(0x14B7AB0) 开头就
     * `BattleFullField.GetEntity(bf, ref attack)`(0x150C200)，取不到实体时打
     * 「BattleMainSkillCast … Failed! AttackEntity on Pointer : {side} is null」
     * （字符串 0x31731F8）并**整条丢弃**，ProcessAbility/召唤分支根本不会执行。
     * 空格（如空布阵时的 index 0）因此会让凭空召唤静默失效。
     *
     * 主将格恒有实体：GetEntity → BattleCamp.GetMainEntityByIndex(0x12DC530)
     * → getBaseSlotByIndex(0x12DDA80) 对 index>=6 的位置走
     * IsHeroOrHeroSkillIndex → heroPos.MainEntity，主将不会离场，可作兜底挂点。
     */
    private GetCasterIndex(human: BattlePlayer): number {
        for (let i = 0; i < BattleConst.FIELD_SIZE; i++) {
            if (human.GetFieldCardUid(i) > 0) {
                return i;
            }
        }
        return BattleConst.HERO_INDEX;
    }
}

RegisterBattleClasses({ BattleBotRoom });
