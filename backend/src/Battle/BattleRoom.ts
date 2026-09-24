import {
    Action,
    AttackType,
    BattleLogSide,
    BattleLogSimple,
    BattleLogType,
    BattleStartResponse,
    ChangeCardRequest,
    ChangeCardResponse,
    DeployActionSimple,
    DeploymentCompleteRequest,
    DeploymentStartResponse,
    FightStartResponse,
    FightStepResponse,
    Hit,
    BattleLogUnit,
    LocationStatus,
    MESSAGE_ID,
    RoomType,
    Battlefield,
    StepType,
    BattleReconnectionResponse,
    ErrorCode,
} from "mc-local-share";
import { BattlePlayer, SummonSpec } from "./BattlePlayer";
import { Client } from "../net/Client";
import { Logger } from "../core/Logger";
import { BattleConst } from "./BattleConst";
import { ActiveEffect, BattleEffectTable, BufferDef } from "./BattleEffectTable";
import { IBattleRound } from "./IBattleState";
import { BattleCard } from "./BattleCard";
import { BattleUnit } from "./BattleUnit";
import { BattleSnapshotStore } from "./BattleSnapshotStore";
import { BuildBattleSnapshot, RegisterBattleClasses } from "./BattleSnapshot";

/**
 * 战斗房间 —— 严格按客户端历史日志（JYLog_Backup）还原的回合驱动。
 *
 * 服务端视角下的完整交互闭环（2 起手 → 换牌 → 抽牌 → 部署 → 战斗 → 结算 → 下一轮）：
 *
 *   C2S 25001 BATTLE_READY_REQ      →（房间集齐 2 人）
 *   S2C 25002 BATTLE_START_REP      进入 CHANGE（换牌）阶段
 *   C2S 25003 CHANGE_CARD_REQ       玩家提交换牌
 *   S2C 25004 CHANGE_CARD_REP       换牌应答（logs: PlayGame/RoundEnter）
 *   S2C 25010 DEAL_STEP_REP         抽牌步骤（roundNum logs: RoundEnter/DisplayGetCard）
 *   S2C 25005 DEPLOYMENT_START_REP  部署开始（battlers 快照 + Snapshot1 日志）
 *   C2S 25006 DEPLOYMENT_COMPLETE_REQ 玩家提交布阵
 *   S2C 25007 FIGHT_START_REP       战斗开始（battlers 快照 + Snapshot2 日志）
 *   S2C 25011 FIGHT_STEP_REP        战斗表现（RoundBegin/RoundFight/伤害/…/RoundEnd）
 *   C2S 25012 SHOW_END_REQ          客户端播完表现
 *   → 回到 S2C 25010 + 25005 开始下一轮（直到 roundNum 打满或主将阵亡）
 *   S2C 25008 BATTLE_END_REP        战斗结束（winInfo / roundNum / quit）
 */
export class BattleRoom implements IBattleRound {
    /** 房间token */
    public RoomToken: string = '';

    /** 战斗token */
    public BattleToken: string = '';

    /** 由 Room.RoundBegin 存下本轮抽到的牌 UID，供 DeploymentStart 组装 dealCached */
    public lastDealUIDs: number[] = [];

    public BattlersDict: Record<string, BattlePlayer> = {};

    public Battlers: BattlePlayer[] = [];

    /** 每个参战者的异步初始化的 Promise（以 uid 为键），供后到者等待全部就绪 */
    private initPromises: Record<string, Promise<void>> = {};

    /**
     * 是否可以发送战斗开始的消息
     * 每位玩家准备完毕则+1
     */
    public IsReady: number = 0;

    /**
     * 战斗是否已经开启，避免重复发送战斗开始消息
     */
    private BattleStarted: boolean = false;

    /**
     * 当前回合号（服务端权威）。
     * 客户端日志中：CHANGE_CARD_REP 记为 Round 1，FIGHT_* 记为 Round 2，
     * 因此首轮换牌/抽牌/部署为 1，首轮战斗结算为 2，之后每轮 +1。
     */
    protected RoundNum: number = 1;

    /**
     * 本局最大回合数。
     * 对应 BATTLE_START_REP.roundNum —— 达到该值仍分不出胜负则平局。
     *
     * 当前 SimulateFight 是骨架实现（不结算伤害），双方主将都不会阵亡，
     * 因此这是唯一的结束条件；设为 10 与日志中一场完整对局的轮数一致。
     */
    protected MaxRoundNum: number = 10;

    /** 战斗是否已结束 */
    protected BattleEnded: boolean = false;

    /**
     * 当前所处阶段（20002 重连应答的 step 字段）。
     *
     * 客户端 `JYBattleData.setDataWhenReconnect` 只用 roundNum + step 决定状态机落点
     * （`BattleUtils.SwitchStateEnum` → `EventBattleWeakReconSuc`），因此服务端必须在每个
     * 「等待客户端提交」的关口更新它，否则重连后会跳错阶段。
     */
    protected CurrentStep: StepType = StepType.NOT_CHANGE;

    /** 每个玩家的布阵是否已经提交（按 side 记录），两人都提交才开打 */
    protected DeployCompleted: Record<number, boolean> = {};

    /**
     * 本轮是否已经开打（FIGHT_START + FIGHT_STEP 是否已下发）。
     *
     * 防守场景：真人 25006 与机器人 25006 都走异步路径，若一方的提交在对方
     * 开打「之后」才到达，DeployCompleted 里早已集齐两人，会再次满足条件并
     * 重复下发一轮 FIGHT_START/FIGHT_STEP。用该标记保证每轮只开打一次，
     * 在 DeploymentStart（新一轮开始）时复位。
     */
    protected FightTriggered: boolean = false;

    /**
     * 本轮已发来 25012（播完表现）的玩家，按 side 记录。
     *
     * 必须等**双方**都播完才推进，不能认第一条：机器人播完只需 ~2s，真人播放一轮
     * 表现要 5-7s，抢跑的那条会把回合直接推进到下一轮，真人本轮的部署时间窗被整段跳过。
     */
    protected ShowEndReceived: Record<number, boolean> = {};

    /**
     * 本轮 25011 对应的回合号，用于判定 25012 属于哪一轮（见 ShowEnd）。
     * 双方布阵完成、开始下发表现时写入。
     */
    protected ShowEndRound: number = 0;

    /**
     * 本轮是否已经推进过（25012 的幂等标记）。
     *
     * 推进后 DEAL_STEP/DEPLOYMENT_START 会开启新一回合状态，此时若有迟到的 25012
     * 到达（它属于上一轮），必须忽略，否则表现为回合被重复推进。
     */
    protected ShowEndDone: boolean = false;

    /**
     * 【快照恢复】本房间是否由进程重启前的快照重建、尚未补驱动。
     *
     * 只在恢复路径上置 true（不落盘语义上等价 false：恢复后立刻消费）。
     * 恢复出来的房间缺两样东西：出站 Client（重连时换绑）与机器人那一侧的「待提交」
     * 定时器（随旧进程一起消失了），所以必须补驱动一次，否则房间永远等不到下一步。
     */
    public ResumePending: boolean = false;

    constructor(preset: any) {
        Object.assign(this, preset);
    }

    // ===========================================================================
    // 快照：落盘 / 重建 / 补驱动
    // ===========================================================================

    /**
     * 在「等待客户端提交」的静默点把房间状态落盘。
     *
     * 只在这类时刻写：此刻服务端已经发完该阶段的所有消息、正等着 C2S，
     * 重启后按 CurrentStep 就能自洽地续上。若在两条消息之间落盘（例如 25004 已发、
     * 25005 未发），恢复出来的状态与客户端已收到的进度就会错位。
     */
    protected SaveSnapshot(reason: string): void {
        BattleSnapshotStore.Save(BuildBattleSnapshot(this));
        Logger.LogInfo(`BattleRoom[${this.RoomToken}] 快照落盘（${reason}）round=${this.RoundNum} step=${this.CurrentStep}`);
    }

    /** 战斗已结算：清除快照，下次启动不应再把玩家拖回这场已结束的战斗 */
    protected DropSnapshot(): void {
        BattleSnapshotStore.Delete(this.RoomToken);
    }

    /**
     * 【快照重建钩子】由 DeserializeBattleRoom 在对象图还原后调用。
     *
     * Object.create 会跳过构造函数，因此所有「派生字段」和「非序列化的连接期字段」
     * 在这里补齐：Battlers 由 BattlersDict 重新排序派生，initPromises 置空（本房间
     * BattleStarted 已为 true，不会再有人 await 它）。
     */
    public AfterRestore(): void {
        this.initPromises = {};
        this.Battlers = Object.values(this.BattlersDict).sort((a, b) => a.side - b.side);
        this.ResumePending = true;
        Logger.LogInfo(`BattleRoom[${this.RoomToken}] 从快照恢复：round=${this.RoundNum} step=${this.CurrentStep} 参战者=${this.Battlers.map((b) => b.uid).join(',')}`);
    }

    /**
     * 【快照恢复】真人重连换绑 Client 之后调用：延后一拍补驱动被中断的阶段。
     *
     * 必须异步：本方法是在 20001 的 Handle 里被调用的，若同步下发补发消息，
     * 它们会排在 20002 之前进队列，客户端战斗状态机还没落到重连点就会收到
     * 25005/25007，表现为跳阶段或整段被缓存挂起。setImmediate 是宏任务，
     * 而 Client.process 把 20002 入队在当前微任务里就已完成。
     */
    public ResumeAfterRestore(): void {
        if (!this.ResumePending) {
            return;
        }
        this.ResumePending = false;
        setImmediate(() => this.ResumePhase());
    }

    /**
     * 按当前阶段补驱动。
     *
     * 机器人（BattlePlayerBotReplay）的提交动作由服务端下发的事件触发（OnDeploymentStart
     * / OnFightStep），旧进程里排好的定时器随进程消失，因此这里按阶段重放一次事件。
     * 各钩子自身带幂等保护（DeploySubmitted / ChangeCardDone），不会重复提交。
     */
    protected ResumePhase(): void {
        switch (this.CurrentStep) {
            case StepType.BEFORE_DEPLOYMENT:
                /** 真人重连后落在布阵界面；机器人那一侧的 25006 还没排上 */
                Logger.LogInfo(`BattleRoom[${this.RoomToken}] 快照恢复：补驱动布阵阶段 round=${this.RoundNum}`);
                this.NotifyBattlers('OnDeploymentStart');
                break;
            case StepType.AFTER_DEPLOYMENT:
            case StepType.SHOW:
                /** 战斗表现已下发，缺的是机器人那条 25012 */
                Logger.LogInfo(`BattleRoom[${this.RoomToken}] 快照恢复：补驱动表现推进 round=${this.RoundNum}`);
                this.NotifyBattlers('OnFightStep');
                break;
            default:
                /** BEFORE_CHANGE_CARD 等阶段在等真人提交，服务端侧无事可做 */
                Logger.LogInfo(`BattleRoom[${this.RoomToken}] 快照恢复：step=${this.CurrentStep} 无需补驱动`);
                break;
        }
    }

    async SetBattler(preset: any, BattlerCtor: new (preset?: any) => BattlePlayer = BattlePlayer): Promise<number> {
        let uid = preset.uid || preset.client?.uid || undefined
        if (!uid) {
            Logger.LogWarn(`BattleRoom[${this.RoomToken}] SetBattler 未找到uid`, preset);
            return 0;
        }
        this.IsReady++;
        let NewBallter = new BattlerCtor(preset);

        /**
         * 阵营必须优先取调用方显式指定的 preset.side。
         *
         * 原实现无条件用 this.IsReady（即入场顺序）当阵营，而 BattleStart 里写死了
         * `side: 2` 表示「2 号玩家先手换牌」。若真人客户端第二个入场（IsReady=2），
         * 两者恰好一致还能跑；一旦入场顺序反过来，客户端被告知自己是先手方，
         * 服务端的 side 却是 1，25004 的回合号与手牌归属随即错位，表现为主角回合不推进。
         * 只有在未指定 side 时才退化为按入场顺序分配。
         */
        NewBallter.side = preset.side ?? this.IsReady;

        /**
         * 绑定玩家到字典
         * 必须在初始化战斗信息前绑定，否则异步初始化期间的发牌信息无法回传
         */
        this.BattlersDict[uid] = NewBallter;
        Logger.LogInfo(`BattleRoom[${this.RoomToken}] SetBattler ${uid} ${NewBallter.side}`);

        /**
         * 必须等待战斗信息初始化完成，否则 BattleStart 时主将/手牌仍为空。
         *
         * 异步初始化存在竞态：第二位玩家（真人的 SetBattler）就位时，
         * 第一位玩家（如机器人的数据库初始化）可能尚未完成。这里先把
         * 「该参战者的初始化完成后置标志」的 Promise 登记起来，供后到者在
         * 开战前统一等待全部就绪。
         */
        const initDone = (async () => {
            await NewBallter.InitBattleInfo(preset);
            NewBallter.hasInited = true;
        })();
        this.initPromises[uid] = initDone;
        try {
            await initDone;
        } catch (err) {
            this.IsReady--;
            Logger.LogError(`BattleRoom[${this.RoomToken}] SetBattler ${uid} 初始化战斗信息失败`, err);
            return this.IsReady;
        }

        // 最后一个参战者就位时，等待所有（含较慢的异步初始化）都完成再开战
        if (this.IsReady >= 2 && !this.BattleStarted) {
            await Promise.all(Object.values(this.initPromises));
            if (!this.BattleStarted) {
                this.TryBattleStart();
            }
        }
        return this.IsReady;
    }

    /**
     * 所有玩家准备完毕且战斗信息全部初始化完成后，才发送战斗开始消息
     */
    protected TryBattleStart() {
        if (this.BattleStarted || this.IsReady < 2) {
            return;
        }

        this.BattleStarted = true;
        /* 战斗开始：按 side 排序，避免字典整数键导致的乱序 */
        this.Battlers = Object.values(this.BattlersDict).sort((a, b) => a.side - b.side);
        this.BattleStart();
    }

    // ===========================================================================
    // 回合阶段分发（IBattleRound）
    // 大阶段：Room → BattlePlayer → BattleUnit 逐层触发；每场战斗再走 FightBegin/End。
    // ===========================================================================

    /**
     * 回合开始：抽牌 + 法力回复 + 各单位 RoundBegin。
     * 必须在 DealStep（抽牌步骤）之前调用，保证 DisplayGetCard 与手牌一致。
     */
    RoundBegin(): void {
        this.RoundNum += 1;
        this.lastDealUIDs = [];
        for (let battler of this.Battlers) {
            let drawn = battler.RoundBegin();
            for (let uid of drawn) {
                if (uid) this.lastDealUIDs.push(uid);
            }
        }
    }

    /** 回合进入战斗：分发给每个战位者的 RoundFightBegin */
    RoundFightBegin(): void {
        for (let battler of this.Battlers) {
            battler.RoundFightBegin();
        }
    }

    /** 回合战斗结束：分发给每个战位者的 RoundFightEnd */
    RoundFightEnd(): void {
        for (let battler of this.Battlers) {
            battler.RoundFightEnd();
        }
    }

    /** 回合结束：分发给每个战位者的 RoundEnd */
    RoundEnd(): void {
        for (let battler of this.Battlers) {
            battler.RoundEnd();
        }
    }

    /**
     * 【S2C 25002】战斗开始。
     *
     * 携带双方完整初始状态（BattlerSimple：主将/手牌/牌库/墓地/装备）与玩家展示信息
     * （BattlerInfoSimple）。发送完毕后进入 CHANGE（换牌）阶段，等待 25003。
     */
    BattleStart() {

        let battlers = this.Battlers.map((battler) => {
            return battler.GetBattler();
        });

        let infos = this.Battlers.map((battler) => {
            return battler.GetInfo();
        });

        let info: BattleStartResponse = {
            roomType: RoomType.LADDER_ROOM,
            token: this.BattleToken!,
            roomToken: this.RoomToken!,
            waitingTime: BattleConst.PHASE_WAITING_TIME,
            enemyQuickBattle: true,
            roundNum: this.MaxRoundNum,
            /** 为了模拟方便，默认玩家为2号，1号是机器人 */
            side: 2,
            actions: [],
            infos: infos,
            battlers: battlers,
        }

        Logger.LogInfo(`BattleRoom[${this.RoomToken}] 发送战斗开始信息：${MESSAGE_ID.BATTLE_START_REP}`, info);
        for (let battler of this.Battlers) {
            battler.SendMessage(MESSAGE_ID.BATTLE_START_REP, info);
        }

        /** 进入换牌阶段：等待客户端 25003 */
        this.CurrentStep = StepType.BEFORE_CHANGE_CARD;
        this.SaveSnapshot('换牌阶段开始');
    }

    /**
     * 【C2S 25003 → S2C 25004/25010/25005】玩家更换手牌，换牌阶段结束。
     *
     * 服务端顺序（与日志一致）：
     *   ① 25004 CHANGE_CARD_REP  —— 给换牌发起者返回换到的牌（logs 含 PlayGame）
     *   ② 25010 DEAL_STEP_REP    —— 抽牌步骤，roundNum=1，logs=[RoundEnter, DisplayGetCard×N]
     *   ③ 25005 DEPLOYMENT_START_REP —— 部署开始，下发双方快照 + Snapshot1 日志
     *
     * ⚠ 顺序不可调换：客户端 C# 状态机 `JYBattleStateChangeCard` 停留在 ChangeCard
     * 状态，其唯一出口 CHANGE_2_DEAL 由收到 25004（MCNetManager.OnChangeCard）触发。
     * 若 25010/25005 先到，会被 BattleNetMsgCacheManager 按回合号缓存并挂起
     * （其基准 LocalRoundIndex 要等 25004 到达才推进），客户端将永久卡在换牌界面。
     * 因此这里**必须先显式下发 25004**，再做后续广播。
     *
     * @param uid 换牌玩家
     * @param req 换牌参数（cardUids / quickBattle）
     */
    async ChangeCard(uid: string, req: ChangeCardRequest): Promise<ChangeCardResponse> {
        let battler = this.BattlersDict[uid];
        if (!uid || !battler) {
            Logger.LogWarn(`BattleRoom[${this.RoomToken}] ChangeCard 未找到玩家 ${uid}`);
            return undefined as any;
        }

        let rep = await battler.ChangeCard(req);

        /**
         * PlayGame 的 intParams 也需携带当前回合数（对齐 BattleHistoryMgr.lua 定义：
         * "PlayGame intParams：当前回合数"）。BattlePlayer 无回合号，故在此注入。
         */
        let pgLog = rep.logs?.find((l) => l.type === BattleLogType.PlayGame);
        if (pgLog && pgLog.battleParams?.[0]) {
            pgLog.battleParams[0].intParams = [this.RoundNum];
        }

        /**
         * 先下发 25004：换牌阶段的应答必须早于 25010 / 25005，
         * 否则客户端状态机不会从 ChangeCard 迁移到 Deal（详见方法头注释）。
         */
        Logger.LogInfo(`BattleRoom[${this.RoomToken}] 换牌应答：${MESSAGE_ID.CHANGE_CARD_REP}`);
        battler.SendMessage(MESSAGE_ID.CHANGE_CARD_REP, rep);

        /** 该玩家换牌已完成：若此刻重连，客户端应落到「换牌后」而不是重复弹换牌界面 */
        this.CurrentStep = StepType.AFTER_CHANGE_CARD;

        /**
         * 再广播 25010 / 25005（房间级，双方都要收到）。
         * 进入抽牌/部署前先执行回合开始阶段（抽牌 + 法力回复 + 单位 RoundBegin）。
         */
        this.RoundBegin();
        this.DealStep();
        this.DeploymentStart();

        /**
         * 返回 undefined 阻止 Client.process 重复下发 25004。
         *
         * 25004 已在上方显式发出；若这里再把 rep 交回去，Client.process 会二次编码下发，
         * 造成同一 msgId 占两格 order，客户端逻辑序随即跳号（drop invalid package）。
         */
        return undefined as any;
    }

    /**
     * 【S2C 25010】抽牌步骤。
     *
     * DealStepResponse：{ roundNum, actions, logs }。
     * logs 顺序（日志实证）：RoundEnter(NullSide) → DisplayGetCard(SideA) → DisplayGetCard(SideB)。
     * 这里对每个玩家各自下发一份「以自己为主视角」的日志。
     */
    protected DealStep() {
        for (let battler of this.Battlers) {
            /**
             * RoundEnter 属于 E_ROUND_HISTORY_TYPE，客户端 BattleHistoryMgr 会读取其
             * battleParams[1].intParams[1] 作为当前回合数；缺该参数会触发
             * 「Battle History Get Round Num Fail」并导致 Lua 崩溃。
             */
            let logs = [
                battler.MakeLog(BattleLogType.RoundEnter, BattleLogSide.NullSide, [], [this.RoundNum]),
                battler.MakeLog(BattleLogType.DisplayGetCard, BattleLogSide.SideA),
                battler.MakeLog(BattleLogType.DisplayGetCard, BattleLogSide.SideB),
            ];

            let rep = {
                roundNum: this.RoundNum,
                actions: [],
                logs: logs,
            };

            Logger.LogInfo(`BattleRoom[${this.RoomToken}] 发送抽牌步骤：${MESSAGE_ID.DEAL_STEP_REP} round=${this.RoundNum}`);
            battler.SendMessage(MESSAGE_ID.DEAL_STEP_REP, rep);
        }

        /** 通知可编程对手（回放机器人）此处可模拟 C2S 25003 开局换牌 */
        this.NotifyBattlers('OnDealStep');
    }

    /**
     * 通知战场内的可编程玩家（如 BattlePlayerBotReplay）在某个阶段做出反应。
     *
     * 采用鸭子类型（检查方法是否存在）而非引入统一接口，避免 BattlePlayer 基类
     * 被回放专用逻辑污染：只有实现了对应钩子的子类才会被触发。
     *
     * @param hook 钩子名（OnDealStep / OnDeploymentStart / OnFightStep）
     */
    protected NotifyBattlers(hook: string) {
        for (let battler of this.Battlers) {
            let fn = (battler as any)[hook];
            if (typeof fn === 'function') {
                fn.call(battler);
            }
        }
    }

    /**
     * 【S2C 25005】部署开始。
     *
     * DeploymentStartResponse：{ waitingTime, battlers, logs, penaltyTimes, dealCached }。
     * logs 顺序（日志实证）为 Snapshot1(SideA) + Snapshot1(SideB)，即双方场面快照。
     * dealCached 为本回合新抽到的牌 uid，供客户端做发牌缓存对齐。
     */
    protected DeploymentStart() {
        /**
         * 本轮抽到的牌在 RoundBegin（回合开始阶段）已抽好，这里直接用其 UID 组装 dealCached，
         * 供客户端做发牌缓存对齐（DisplayGetCard 需与手牌一致）。
         */
        let dealCached: number[] = [...this.lastDealUIDs];

        /**
         * 复位本轮状态**必须在下发 25005 之前**完成。
         *
         * SendMessage 是同步调用：真实客户端/回放机器人会在收到 25005 的当场
         * 立刻回一个 25006。若复位放在广播之后，这次提交会被 DeployCompleted={}
         * 直接抹掉，表现为「本轮部署阶段永远等不到开打」。
         */
        this.DeployCompleted = {};
        this.FightTriggered = false;
        this.ShowEndReceived = {};
        this.ShowEndDone = false;

        for (let battler of this.Battlers) {
            battler.BeginDeployment();
            let battlers = this.Battlers.map((b) => b.GetBattler());
            let logs = [
                battler.MakeLog(BattleLogType.Snapshot1, BattleLogSide.SideA),
                battler.MakeLog(BattleLogType.Snapshot1, BattleLogSide.SideB),
            ];

            let rep: DeploymentStartResponse = {
                waitingTime: BattleConst.PHASE_WAITING_TIME,
                battlers: battlers,
                logs: logs,
                penaltyTimes: 0,
                dealCached: dealCached,
            };

            // Logger.LogInfo(`BattleRoom[${this.RoomToken}] 发送部署开始：${MESSAGE_ID.DEPLOYMENT_START_REP}`, rep);
            battler.SendMessage(MESSAGE_ID.DEPLOYMENT_START_REP, rep);
        }

        /** 部署阶段已开启：等待客户端 25006 */
        this.CurrentStep = StepType.BEFORE_DEPLOYMENT;
        this.SaveSnapshot('布阵阶段开始');

        /** 通知可编程对手（回放机器人）此处可模拟 C2S 25006 布阵提交 */
        this.NotifyBattlers('OnDeploymentStart');
    }

    /**
     * 【C2S 25006 → S2C 25007/25011】玩家布阵完成。
     *
     * 双方都提交后（或一方超时）进入战斗结算：
     *   ① 25007 FIGHT_START_REP —— 战斗开始，下发双方快照 + Snapshot2 日志
     *   ② 25011 FIGHT_STEP_REP  —— 战斗表现，logs 按回合结算顺序生成
     * 之后等待客户端 25012（播完表现）再进入下一轮。
     *
     * @param uid 布阵完成的玩家
     * @param req 布阵动作
     */
    async DeploymentComplete(uid: string, req: DeploymentCompleteRequest): Promise<void> {
        let battler = this.BattlersDict[uid];
        if (!battler) {
            Logger.LogWarn(`BattleRoom[${this.RoomToken}] DeploymentComplete 未找到玩家 ${uid}`);
            return;
        }

        battler.ApplyDeploy(req.action ?? []);
        this.DeployCompleted[battler.side] = true;

        /**
         * 记下本轮布阵原文与回合号：客户端在本轮内弱重连时，20002 要回填 deployAction，
         * 房间也要据此判定「这一侧其实已经提交过」，避免重连后又等一次 25006。
         */
        battler.LastDeployActions = req.action ?? [];
        battler.DeployedRound = this.RoundNum;

        Logger.LogInfo(`BattleRoom[${this.RoomToken}] ${uid}(side=${battler.side}) 布阵完成`, req.action);

        /**
         * 双方都提交完毕才开打。
         *
         * 加 FightTriggered 兜底：一方提交若在开打之后才到达（异步竞态），
         * DeployCompleted 仍满足人数条件，此时必须直接返回，避免重复开打。
         */
        if (this.FightTriggered) {
            Logger.LogWarn(`BattleRoom[${this.RoomToken}] ${uid} 布阵提交到达时本轮已开打，忽略`);
            return;
        }

        if (Object.keys(this.DeployCompleted).length < this.Battlers.length) {
            return;
        }

        this.FightTriggered = true;
        /** 双方均已提交布阵：等待 25007/25011 下发（此区间重连落在 AFTER_DEPLOYMENT） */
        this.CurrentStep = StepType.AFTER_DEPLOYMENT;
        this.ShowEndRound = this.RoundNum;
        this.FightStart();
        this.FightStep();
        /** 表现已下发：等待客户端 25012 */
        this.CurrentStep = StepType.SHOW;
        this.SaveSnapshot('表现待播完');

        /**
         * 战斗已结束 → **紧接着 25011 下发 25008**，不等客户端 25012。
         *
         * 真实服务器录像（LUA/Rec/pve_1000*.rec，tools/rec_stream.py 可读）的报文流是
         *   25002 25004 [25010 25005 25007 25011]×N 25008
         * 即最后一轮 25011 之后**没有** 25010，25008 直接跟在 25011 后面。
         * 客户端每播完一轮就按「下一条期望 DEAL_STEP_REP(25010)」排队消费缓存
         * （JYLog：`Satrt WaitProcessCacheData Msg : N, Msg Id: DEAL_STEP_REP`）。
         * 若把 25008 留到收到 25012 之后再发，客户端会一直等那条永远不来的 25010，
         * BATTLE_END_REP 被缓存却无人消费，约 20 秒后走 `Recon_WaitBattleResult` 重连，
         * 界面停在「连接中」。
         */
        if (this.IsBattleOver()) {
            this.BattleEnd();
        }
    }

    /**
     * 【S2C 25007】战斗开始。
     *
     * FightStartResponse：{ roundNum, battlers, logs }。
     * logs 顺序（日志实证）为 Snapshot2(SideA) + Snapshot2(SideB)；
     * 第 2 回合起会先出现一条 DisplayMove，让先手方已是场上的牌先移动到位，
     * 再接 Snapshot2 快照（与真实日志 25007 的 logs 一致）。
     */
    protected FightStart() {

        for (let battler of this.Battlers) {
            let battlers = this.Battlers.map((b) => b.GetBattler());
            let logs: BattleLogSimple[] = [];

            /**
             * 第 2 回合起，FieldWarn 逐格翻开前会先出现 DisplayMove，让被「推挤」(PUSH) 换格的
             * 已在场单位在快照前先移动到新的格位（真实日志中第 2/4/6/9/14 回合的 25007 出现）。
             *
             * ⚠ 必须携带本方当战场上每个单位的**当前 field**（GetFieldUnits），客户端据此把
             * 单位从旧格迁移到新格；若像旧实现那样 units 为空，被推挤单位在客户端棋盘上仍停在
             * 旧格，导致后续它在新格发起/承接的战斗动作不挂在它身上，表现为「推挤后不再执行动作」。
             */
            if (this.RoundNum >= 2) {  // 修复：从第 2 回合开始就需要 DisplayMove，而不是>2
                for (let mover of this.Battlers) {
                    let units = mover.GetFieldUnits();
                    if (units.length === 0) {
                        continue;
                    }
                    logs.push(mover.MakeLog(
                        BattleLogType.DisplayMove,
                        mover.side === this.Battlers[0].side ? BattleLogSide.SideA : BattleLogSide.SideB,
                        units,
                        [mover.side],
                    ));
                }
            }

            logs.push(battler.MakeLog(BattleLogType.Snapshot2, BattleLogSide.SideA));
            logs.push(battler.MakeLog(BattleLogType.Snapshot2, BattleLogSide.SideB));

            let rep: FightStartResponse = {
                roundNum: this.RoundNum,
                battlers: battlers,
                logs: logs,
            };

            Logger.LogInfo(`BattleRoom[${this.RoomToken}] 发送战斗开始：${MESSAGE_ID.FIGHT_START_REP} round=${this.RoundNum} logs=${logs.length}`);
            battler.SendMessage(MESSAGE_ID.FIGHT_START_REP, rep);
        }
    }

    /**
     * 【S2C 25011】战斗逐步表现。
     *
     * FightStepResponse：{ roundNum, actions, logs }。
     * logs 由 BattlePlayer.SimulateFight 计算（RoundBegin / RoundFight / FieldWarn /
     * DisplayBorn / 技能 / DisplayAddBuffer / 伤害 / RoundEnd）。
     */
    protected FightStep() {
        let { logs, actions } = this.SimulateFight();

        for (let battler of this.Battlers) {
            let rep: FightStepResponse = {
                roundNum: this.RoundNum,
                actions: actions,
                logs: logs,
            };

            // Logger.LogInfo(`BattleRoom[${this.RoomToken}] 发送战斗步骤：${MESSAGE_ID.FIGHT_STEP_REP} round=${this.RoundNum} logs=${logs.length} actions=${actions.length}`,rep);
            battler.SendMessage(MESSAGE_ID.FIGHT_STEP_REP, rep);
        }

        /** 通知可编程对手（回放机器人）此处可模拟 C2S 25012 播完表现 */
        this.NotifyBattlers('OnFightStep');
    }

    /**
     * 【C2S 25012】客户端播放完毕本轮表现，推进到下一轮。
     *
     * 若已达到最大回合数或任一方主将阵亡，则发送 25008 BATTLE_END_REP 结束战斗；
     * 否则回到 25010 + 25005，开始下一轮的抽牌与部署。
     *
     * @param uid 触发推进的玩家
     */
    async ShowEnd(uid: string): Promise<void> {
        if (this.BattleEnded) {
            Logger.LogWarn(`BattleRoom[${this.RoomToken}] ShowEnd 战斗已结束，忽略 ${uid}`);
            return;
        }

        /**
         * 本轮已推进过 → 迟到的 25012（属于上一轮的表现回放），忽略。
         */
        if (this.ShowEndDone) {
            Logger.LogWarn(`BattleRoom[${this.RoomToken}] ${uid} 25012 到达时本轮已推进，忽略`);
            return;
        }

        /**
         * 只接受「本轮的表现播完」上报。
         *
         * 25012 报文里没有任何回合号（ShowEndRequest 是空结构），只能靠服务端状态对齐：
         * 下一轮的 25005 会把 ShowEndDone 复位，迟到的上一轮上报会被当成新一轮的，
         * 表现为同一轮重复下发 25010 + 25005（客户端部署计时被重置）。
         * 用回合号而不是 CurrentStep 判断：25011 是同步下发的，客户端在 SendMessage
         * 里就地回 25012，那时 CurrentStep 还停在 AFTER_DEPLOYMENT。
         */
        if (this.ShowEndRound !== this.RoundNum) {
            Logger.LogWarn(`BattleRoom[${this.RoomToken}] ${uid} 25012 属于第 ${this.ShowEndRound} 轮，当前 ${this.RoundNum} 轮，忽略`);
            return;
        }

        let battler = this.BattlersDict[uid];
        if (!battler) {
            Logger.LogWarn(`BattleRoom[${this.RoomToken}] ShowEnd 未找到玩家 ${uid}`);
            return;
        }

        /**
         * 双方都播完表现才推进。
         *
         * 机器人延迟远小于真人播放一轮表现的时间，先到先得会让真人被跳过部署，
         * 所以这里按 side 计数而不是认第一条；同一方重复上报只记一次。
         */
        this.ShowEndReceived[battler.side] = true;
        let waiting = this.Battlers.filter((b) => !this.ShowEndReceived[b.side]).map((b) => b.uid);
        if (waiting.length > 0) {
            Logger.LogInfo(`BattleRoom[${this.RoomToken}] ${uid} 播完表现，等待 ${waiting.join(',')} round=${this.RoundNum}`);
            return;
        }
        this.ShowEndDone = true;

        /**
         * 胜负判定见 IsBattleOver；正常路径下 25008 已随本轮 25011 一并下发（见
         * DeploymentComplete），此处只会走到「进入下一轮」分支。
         */
        if (this.IsBattleOver()) {
            this.BattleEnd();
            return;
        }

        /**
         * 下一轮：回合号推进后先执行回合开始阶段（抽牌 + 法力 + 单位 RoundBegin），
         * 再广播 DEAL_STEP / FIGHT_START。
         */
        Logger.LogInfo(`BattleRoom[${this.RoomToken}] ${uid} 播完表现，进入下一轮 round=${this.RoundNum}`);
        this.RoundBegin();
        this.DealStep();
        this.DeploymentStart();
    }

    /**
     * 本轮结算后战斗是否终止：任一方主将 HP <= 0，或打满最大回合数。
     * 必须在 SimulateFight 之后调用（HP/死亡由它写入）。
     */
    protected IsBattleOver(): boolean {
        let dead = this.Battlers.filter((b) => b.hero.curHP <= 0);
        return dead.length > 0 || this.RoundNum >= this.MaxRoundNum * 2;
    }

    /**
     * 【S2C 25008】战斗结束。
     *
     * BattleEndResponse：{ winInfo, roundNum, quit }。
     * winInfo 以「接收者视角」给出：1 表示胜利，2 表示失败（与 BATTLE_START_REP.side 对应）。
     */
    protected BattleEnd() {
        this.BattleEnded = true;
        this.CurrentStep = StepType.END;

        let alive = this.Battlers.filter((b) => b.hero.curHP > 0);
        /**
         * 平局（双方都存活或都阵亡）时 winInfo = 0
         */
        let winnerSide = alive.length === 1 ? alive[0].side : 0;

        for (let battler of this.Battlers) {
            let winInfo = winnerSide === 0 ? 0 : (battler.side === winnerSide ? 1 : 2);
            let rep = {
                winInfo: winInfo,
                roundNum: this.RoundNum,
                quit: 0,
            };

            Logger.LogInfo(`BattleRoom[${this.RoomToken}] 发送战斗结束：${MESSAGE_ID.BATTLE_END_REP} winInfo=${winInfo}`);
            battler.SendMessage(MESSAGE_ID.BATTLE_END_REP, rep);
        }

        /** 本局已有结论：删除快照，重启后不该再把玩家拖回已结束的战斗 */
        this.DropSnapshot();
    }

    /** 本局是否已结算完毕（25008 已下发）：决定重启后还需不需要把玩家拉回战斗 */
    public IsFinished(): boolean {
        return this.BattleEnded;
    }

    /**
     * 【C2S 20001 → S2C 20002】战斗弱重连。
     *
     * 客户端的弱重连流程（实证 JYLog_Backup/2021-04-08-23-24-44.log 第 1691-2130 行）：
     *   ① 表现层等待超时 → `NetManager.ResetBattle()` + `StartReconnect('Recon_WaitXxxMsg')`，
     *      **另建一条 WebSocket**（`CreateWebSocketClient`）并在新连接上发 20001；
     *   ② 收到 20002 → `OnBattleReconnect` → `Reconnect WeakReconn` → 用 battlers 复原召唤者
     *      （`Set summor data , but not crate a new obj!!!`）；
     *   ③ `DoReconnect! CurState → TargetState`（由 step 决定）→ `SyncFromReconnectData`
     *      （roundNum 与本地比较，落后则 `IsLocalValid False`）；
     *   ④ **把 logs 整份交给 Lua 的 BattleHistoryMgr**：先清空本地回合数据，再按序重放
     *      （日志里从第 1 轮的 PlayGame 一路 Convert 到当前轮），据此复原棋盘与手牌表现；
     *   ⑤ 回到对应阶段继续正常收发（日志中重连后玩家继续 `放下扣牌` 布阵）。
     *
     * 因此本方法必须：把 battler 的出站 Client 换绑到新连接，并回整局日志历史 + 双方快照。
     *
     * @param uid 重连玩家
     * @param client 新连接对应的 Client
     */
    Reconnect(uid: string, client: Client): BattleReconnectionResponse {
        let battler = this.BattlersDict[uid];
        if (!battler) {
            Logger.LogWarn(`BattleRoom[${this.RoomToken}] Reconnect 未找到玩家 ${uid}`);
            return { error: ErrorCode.SESSION_NOT_FIND } as BattleReconnectionResponse;
        }
        if (!battler.hasInited) {
            Logger.LogWarn(`BattleRoom[${this.RoomToken}] Reconnect ${uid} 战斗信息未就绪`);
            return { error: ErrorCode.SERVICE_NOT_READY } as BattleReconnectionResponse;
        }

        /**
         * 换绑出站通道：旧 socket 断开时 ConnManager 已移除旧 Client，
         * 若不换绑，后续 25005/25011 会发到死连接上（sendS2C 报「连接已不存在」）。
         */
        battler.client = client;

        /** 本轮已提交过布阵 → 恢复 DeployCompleted，避免重连后重复等待 25006 */
        if (battler.DeployedRound === this.RoundNum) {
            this.DeployCompleted[battler.side] = true;
        }

        let rep: BattleReconnectionResponse = {
            error: ErrorCode.SUCCESS,
            /** 战斗通道 token：客户端在新 socket 上仍用它标记战斗频道 */
            token: this.BattleToken,
            roomToken: this.RoomToken,
            roomType: RoomType.LADDER_ROOM,
            quickBattle: false,
            /** 服务端权威回合号（客户端据此判断本地数据是否落后） */
            roundNum: this.RoundNum,
            step: this.CurrentStep,
            needFlush: false,
            /** 仍是「自己视角」的阵营，与 25002 的 side 一致 */
            side: battler.side,
            selfWin: false,
            enemyWin: false,
            battlers: this.Battlers.map((b) => b.GetBattler()),
            infos: this.Battlers.map((b) => b.GetInfo()),
            /** 换牌阶段的勾选结果：已进入后续阶段，无需再选，回空表 */
            selectedCards: [],
            waitingTime: BattleConst.PHASE_WAITING_TIME,
            enemyID: 0,
            /** 整局表现日志，客户端从头重放 */
            logs: battler.HistoryLogs,
            autoDeploy: false,
            deployAction: battler.LastDeployActions,
            penaltyTimes: 0,
            dealCached: [...this.lastDealUIDs],
        };

        Logger.LogInfo(`BattleRoom[${this.RoomToken}] ${uid} 弱重连：round=${this.RoundNum} step=${this.CurrentStep} logs=${rep.logs.length}`);

        /**
         * 快照恢复出来的房间（跨进程重启）在真人已换绑出站通道后补驱动一次。
         * 放在组装完应答之后：20002 先入队，补发的 25005/25007 才有正确的先后次序。
         */
        this.ResumeAfterRestore();

        return rep;
    }

    /**
     * 全局战斗结算（编排层，不依赖任何单一 BattlePlayer 的内部实现）。
     *
     * 承担所有需要「同时看到双方」的跨玩家逻辑：
     *   - **逐格并行（问题 1）**：双方 6 个地块按 index 0..5 同步推进，每个格位上双方单位
     *     “同时”结算，而不是先结算某方 6 格、再结算另一方 6 格。
     *   - **区分新登场与已在场（问题 2）**：只有「本轮新部署」的单位才 DisplayBorn（召唤登场），
     *     已在场（上一轮翻开）的单位不再重复召唤，转为执行攻击动作。
     *
     * 各 BattlePlayer 仅通过自己的「单实例原语」（GetUnit/GetCanAttackUnit/ApplyUnitDamage/
     * OnUnitDead/HeroTakeDamage …）协作，彼此不直接引用。
     *
     * 单个格位的结算顺序：
     *   ① FieldWarn 标出本格进入行动结算；
     *   ② 翻开本格双方「本轮新部署」的单位；
     *   ③ 结算本格双方「已在场」单位的攻击（被阻挡则相拼，无阻挡则打主将；飞行仅被飞行阻挡）。
     */
    protected SimulateFight(): { logs: BattleLogSimple[]; actions: Action[] } {
        let logs: BattleLogSimple[] = [];
        let actions: Action[] = [];
        let battlers = this.Battlers;

        /** 战斗回合开始节点 */
        logs.push(this.MakeRoomLog(BattleLogType.RoundBegin, [], [this.RoundNum]));
        logs.push(this.MakeRoomLog(BattleLogType.RoundFight, [], [this.RoundNum]));
        actions.push(this.MakeRoomStep(AttackType.RoundBeginStep));

        /** Room.RoundFightBegin → Player.RoundFightBegin → Unit.RoundFightBegin */
        this.RoundFightBegin();

        /**
         * 先播发本轮部署阶段产生的表现日志（如使用法术的 DisplayHandThrow /
         * DisplayAddToCemetery），再接逐格战斗结算。
         */
        for (let battler of battlers) {
            if (battler.DeployLogs && battler.DeployLogs.length > 0) {
                logs.push(...battler.DeployLogs);
            }
        }

        /** 【扩展点】战斗表现节点已就绪、逐格结算开始前：可在此就地发起召唤等战斗事件 */
        this.OnFightBegin(logs, actions);

        /**
         * 逐格结算（两行三列，同列阻挡；本格双方可行动单位同时交手）。
         *
         * 每格顺序：
         *   ② 标出本格进入行动结算（FieldWarn）；
         *   ③ 翻开本格双方「扣着的 PUT 牌」——法术进墓 / 单位 Spawn；
         *   ④ 翻牌完成后，再结算本格战斗（同列阻挡 + 同时交手）。
         */
        for (let index = 0; index < BattleConst.FIELD_SIZE; index++) {

            // 问题 1 修复：无论有无牌，都显示 FieldWarn，同时展示双方的地块状态
            /** 标出本格进入行动结算（FieldWarn, NullSide，包含双方地块信息） */
            let fieldWarnAction: Action = {
                b1: battlers.length >= 1 ? { side: battlers[0].side, index: index } : undefined,
                b2: battlers.length === 2 ? { side: battlers[1].side, index: index } : undefined,
                attackType: AttackType.FieldWarn,
                hits: [],
                heros: [],
            };
            actions.push(fieldWarnAction);
            logs.push(this.MakeRoomLog(BattleLogType.FieldWarn, [], [index]));

            /** 翻开本格双方扣着的牌（法术进墓 / 单位 Spawn），翻牌完成后再判战斗 */
            for (let battler of battlers) {
                this.ResolveFlip(battlers, battler, index, logs, actions);
            }

            /** 再结算本格双方单位的战斗（同列阻挡 + 同时交手） */
            this.ResolveFieldCombat(battlers, index, logs, actions);
        }

        /** 回合结束：先分发 RoundFightEnd / RoundEnd，再广播节点 */
        this.RoundFightEnd();
        this.RoundEnd();
        logs.push(this.MakeRoomLog(BattleLogType.RoundEnd, [], [this.RoundNum]));
        actions.push(this.MakeRoomStep(AttackType.RoundEndStep));

        return { logs, actions };
    }

    /**
     * 翻开该格上「扣着的牌」（PUT Card）并按牌型处理。
     *
     * 每格进入行动结算时，先执行翻牌再判定战斗：
     *   - 若该格已有单位（此前已翻开/在场）→ 无需翻牌，直接交给后续战斗判定；
     *   - 若无单位但格上有扣牌 → 翻开：
     *       · 法术 / 主将技牌 → 翻开即消耗进墓，再结算它的 Skill 效果（ResolveMagic）；
     *       · 单位牌 → 执行 Spawn 召唤单位（BattlePlayer.CreateUnit 内部触发 BattleUnit.Spawn），
     *         并产出 DisplayBorn 召唤登场表现。
     *
     * 主将技走的是同一条路：它在布阵阶段就是一张扣在地块上的 Magic 牌
     * （见 BattlePlayer.CreateHeroSkillCard），因此同样受翻开顺序与推挤的影响，
     * 不再有「开战前单独兑现」的特殊时机。
     */
    protected ResolveFlip(battlers: BattlePlayer[], battler: BattlePlayer, index: number, logs: BattleLogSimple[], actions: Action[]): void {
        /** 已翻开/在场单位：无需翻牌 */
        if (battler.GetUnit(index)) {
            return;
        }
        let cardUid = battler.GetFieldCardUid(index);
        if (cardUid <= 0) {
            return;
        }
        let card = battler.AllCards[cardUid];
        if (!card) {
            return;
        }

        /** 法术 / 主将技牌：翻开即进墓，再按 SkillList → Buffers 结算效果 */
        if (card.IsMagic) {
            let discardLogs = battler.DiscardToCemetery(cardUid, index);
            logs.push(...discardLogs);
            this.ResolveMagic(battler, card, logs, actions);
            return;
        }

        /** 单位牌：翻开召唤单位（CreateUnit 内触发 BattleUnit.Spawn） */
        battler.CreateUnit(cardUid, index);
        let bornLog = battler.MakeBornLog(index);
        if (bornLog) {
            logs.push(bornLog);
        }
        let bornAction = battler.MakeBornAction(index);
        if (bornAction) {
            actions.push(bornAction);
        }
    }

    /**
     * 结算一张已翻开的 Magic 牌（法术 / 主将技）的效果。
     *
     * 逐层查表，与「这张牌是怎么来的」无关：
     *   `Cards.SkillList` → `Skills.Buffers` → `Buffers.ActiveEffect` → 派发。
     * 这样主将技与普通法术共用同一条实现，新增效果只需往 BattleEffectTable 里登记
     * 三张表的行，不必再改结算流程。
     *
     * ⚠ 只实现已实证的表现分支。客户端 `ProcessAbility` 只认 ActiveEffect 1..55，
     * 且未列入其 case 的枚举值是**静默空操作**（不报错），所以这里遇到没实现的
     * 效果必须显式告警，而不是当成功。
     */
    protected ResolveMagic(player: BattlePlayer, card: BattleCard, logs: BattleLogSimple[], actions: Action[]): void {
        for (let skillId of card.Current.abilitie?.skillId ?? []) {
            let skill = BattleEffectTable.GetSkill(skillId);
            if (!skill) {
                Logger.LogWarn(`BattleRoom[${this.RoomToken}] ${player.uid} Magic 牌 cid=${card.cid} 的 Skill=${skillId} 未登记，无效果`);
                continue;
            }
            for (let bufferId of skill.buffers) {
                let buffer = BattleEffectTable.GetBuffer(bufferId);
                if (!buffer) {
                    Logger.LogWarn(`BattleRoom[${this.RoomToken}] ${player.uid} Skill=${skillId} 的 Buffer=${bufferId} 未登记，无效果`);
                    continue;
                }
                switch (buffer.activeEffect) {
                    case ActiveEffect.SpecialSummon:
                        this.ResolveSpecialSummon(player, buffer, logs, actions);
                        break;
                    default:
                        Logger.LogWarn(`BattleRoom[${this.RoomToken}] ${player.uid} cid=${card.cid} 的 ActiveEffect=${ActiveEffect[buffer.activeEffect]}(${buffer.activeEffect}) 尚未实现，跳过`);
                        break;
                }
            }
        }
    }

    /**
     * 【ActiveEffect=SpecialSummon(7)】凭空召唤。
     *
     * 参数取自 Buffers 表：`Parm2`=召唤物卡 cid、`Parm3`=数量、
     * `ParmList`=额外赋予召唤物的能力 id（与 Cards 行自身的 PassiveSkilllist 合并去重）。
     * 表现上必须合成**一条** Skill 动作：客户端每播一条 Skill 动作就播一次 Ultra 特写，
     * 然后把该动作的 hits 逐个走 ProcessAbility → SpecialSummon（见 MakeSummonSkillAction）。
     */
    protected ResolveSpecialSummon(player: BattlePlayer, buffer: BufferDef, logs: BattleLogSimple[], actions: Action[]): void {
        let cardDef = BattleEffectTable.GetCard(buffer.parm2);
        if (!cardDef) {
            Logger.LogWarn(`BattleRoom[${this.RoomToken}] ${player.uid} Buffer=${buffer.id} 的召唤物 cid=${buffer.parm2} 未登记，取消召唤`);
            return;
        }

        let spec: SummonSpec = {
            /** 客户端用它校验 Skills 表（查不到即静默放弃召唤），必须是 Buffer/Skill 本体编号 */
            skillId: buffer.id,
            bufferId: buffer.id,
            cid: cardDef.cid,
            cost: cardDef.cost,
            atk: cardDef.atk,
            def: cardDef.def,
            skillIdList: [...cardDef.skillIdList],
            passiveSkillIdList: Array.from(new Set([...cardDef.passiveSkillIdList, ...buffer.parmList])),
            count: buffer.parm3,
        };

        let landed = this.ResolveSummon(player, BattleConst.HERO_INDEX, spec, logs, actions);
        Logger.LogInfo(`BattleRoom[${this.RoomToken}] ${player.uid} SpecialSummon Buffer=${buffer.id} 召唤 cid=${spec.cid} 落格 ${landed}/${spec.count}`);
    }

    /**
     * 结算某个格位上双方单位的战斗（两行三列战场，同列阻挡）。
     *
     * 设计要点（对齐客户端表现）：
     *   1) 一次交锋 = **一条攻击动作**（内含多条 hit）：双方都可主动进攻 → `DualAttack(2)`，
     *      仅单方可主动进攻 → `Attack(1)`，直击主将 → `AttackFace(3)`；动作的 `hits`
     *      同时承载双方受击，保证动画里**同时即时受击**。
     *   2) 单位按自身 `AttackCount` 发动多次进攻（连击的载体）：每次进攻前都会
     *      重新求解目标/阻挡（交锋中先头单位可能阵亡，需重算），攻势方一旦阵亡即终止。
     *   3) 目标/伤害形状集中在 `GetAttackTargets()` **一个扩展点**：
     *      当前默认单目标，后续贯通(打一列)/横扫(打一排)只需改它，命中结算无需再动。
     */
    protected ResolveFieldCombat(battlers: BattlePlayer[], index: number, logs: BattleLogSimple[], actions: Action[]): void {
        let [a, b] = [battlers[0], battlers[1]];

        /** 本格双方都有可行动单位 → 面对面互撞（按各自 AttackCount 轮流交锋）。 */
        if (a.GetCanAttackUnit(index) && b.GetCanAttackUnit(index)) {
            this.ResolveFaceOff(a, index, b, index, logs, actions);
            return;
        }

        /** 单方可行动（或仅一方有能量）→ 各自按 AttackCount 单独进攻。 */
        if (a.GetCanAttackUnit(index)) {
            this.ResolveActiveAttacker(a, index, b, logs, actions);
        }
        if (b.GetCanAttackUnit(index)) {
            this.ResolveActiveAttacker(b, index, a, logs, actions);
        }
    }

    /**
     * 面对面互撞：a / b 同列相对且双方都有进攻能量时，轮流交锋，直到
     * 一方能量耗尽或阵亡退出；退出后由仍可进攻的一方单方面继续（会重新求解目标）。
     */
    protected ResolveFaceOff(a: BattlePlayer, aIdx: number, b: BattlePlayer, bIdx: number, logs: BattleLogSimple[], actions: Action[]): void {
        while (a.GetCanAttackUnit(aIdx) && b.GetCanAttackUnit(bIdx)) {
            /** 一次互相交锋：双方各命中对方一次（两条独立动作），各消耗 1 次进攻。 */
            this.DoClash(a, aIdx, b, bIdx, logs, actions);
            let aU = a.GetUnit(aIdx);
            let bU = b.GetUnit(bIdx);
            if (aU) { aU.AttackCount = Math.max(0, aU.AttackCount - 1); }
            if (bU) { bU.AttackCount = Math.max(0, bU.AttackCount - 1); }
        }
        /** 其中一方退出后，剩余可进攻方继续单方面结算（此时会重新求解目标）。 */
        if (a.GetCanAttackUnit(aIdx)) {
            this.ResolveActiveAttacker(a, aIdx, b, logs, actions);
        } else if (b.GetCanAttackUnit(bIdx)) {
            this.ResolveActiveAttacker(b, bIdx, a, logs, actions);
        }
    }

    /**
     * 结算「单方可行动单位」的进攻序列：按自身 AttackCount 多次进攻，每次进攻前重新求解目标。
     * 攻方阵亡（def<=0）立即终止后续进攻。
     */
    protected ResolveActiveAttacker(atkPl: BattlePlayer, atkIndex: number, defPl: BattlePlayer, logs: BattleLogSimple[], actions: Action[]): void {
        let atkU = atkPl.GetCanAttackUnit(atkIndex);
        while (atkU) {
            /** 每次进攻前重新求解目标 —— 阻挡单位可能在上一轮交锋中已阵亡。 */
            let targets = this.GetAttackTargets(atkPl, atkIndex, defPl);

            if (targets.length === 0) {
                /** 无阻挡 → 直击主将（内部消耗 1 次进攻）。 */
                this.ResolveHeroAttack(atkPl, atkIndex, defPl, logs, actions);
            } else {
                /** 有阻挡 → 一次主动进攻命中所有目标（当前仅单目标），并承受正面阻挡反击。 */
                for (let t of targets) {
                    this.DoClash(atkPl, atkIndex, defPl, t, logs, actions);
                }
                atkU.AttackCount = Math.max(0, atkU.AttackCount - 1);
            }
            let survived = atkPl.GetUnit(atkIndex);
            if (!survived || survived.def <= 0) {
                break;
            }
            atkU = atkPl.GetCanAttackUnit(atkIndex);
        }
    }

    /**
     * 【技能扩展点】求解一次主动进攻实际命中的防守方地块列表。
     *
     * 当前默认（具体技能判定待进度推进中再落实，此处仅预留设计）：
     *   - 无正面/同列存活阻挡 → 返回空数组（此时调用方会改打主将）；
     *   - 有阻挡 → 返回 [阻挡格位]（单目标）。
     *
     * 后续扩展伤害形状时，只需改这一个方法并复用现有命中结算：
     *   - 贯通(伤害一列)：返回目标列两个格位，如目标在第 C 列 → 返回 [C, C+3]（或 [C-3, C]）；
     *   - 横扫(伤害一排)：返回阻挡单位所在排的全部格位（第1排 0..2 / 第2排 3..5）。
     * 注意：横扫/贯通命中多目标时，攻方通常只承受「正面阻挡单位」一家的反击，
     * 届时可在 DoClash 中把「攻方命中多个目标」与「仅首个正面阻挡反伤」拆成两步，
     * 避免每个被命中目标都反击一次。
     */
    protected GetAttackTargets(atkPl: BattlePlayer, atkIndex: number, defPl: BattlePlayer): number[] {
        let blocker = this.FindBlocker(defPl, atkIndex);
        return blocker >= 0 ? [blocker] : [];
    }

    /**
     * 攻方 atkIdx 进攻守方 defIdx 的一次贴身交换：双方各中一击，汇成**一条**动作。
     * 伤害 >0 才触发受击/反击。交换结束后统一清理阵亡（Dead 动作 + 进墓）。
     */
    protected DoClash(atkPl: BattlePlayer, atkIdx: number, defPl: BattlePlayer, defIdx: number, logs: BattleLogSimple[], actions: Action[]): void {
        let attacker = atkPl.GetUnit(atkIdx);
        let defender = defPl.GetUnit(defIdx);
        if (!attacker || !defender || attacker.def <= 0 || defender.def <= 0) {
            return;
        }

        /**
         * 在承伤前判定守方是否为「可主动进攻」单位 —— 决定本条交锋动作的 ActionType：
         *   守方同样是主动进攻方 → DualAttack(2)；守方仅为被动阻挡 → Attack(1)。
         * 若等到承伤后再判，守方可能已阵亡（GetCanAttackUnit 返回 null），判定失真。
         */
        let defIsActive = defPl.GetCanAttackUnit(defIdx) != null;

        attacker.FightBegin();
        defender.FightBegin();

        let atkDmg = attacker.atk;
        let defDmg = defender.atk;

        /** 双方同时承伤（伤害 >0 才结算）：守方反击攻击方，攻击方打击守方。 */
        if (defDmg > 0) {
            atkPl.ApplyUnitDamage(attacker, defDmg);
        }
        if (atkDmg > 0) {
            defPl.ApplyUnitDamage(defender, atkDmg);
        }

        /**
         * 一次交锋 → 一条动作（内含多条 hit）：
         *   - 双方都可主动进攻 → DualAttack(2)；
         *   - 仅攻方可主动进攻（守方只是阻挡/本回合召唤/位于非主动进攻格）→ Attack(1)。
         * 无论哪种 Attack，双方伤害 >0 都各自形成一条 hit，客户端在一次表现里「一起掉血」，
         * 避免拆成多条动作造成先后进攻 / 双倍受击。
         */
        let clash = this.MakeClashAction(atkPl, atkIdx, defPl, defIdx, atkDmg, defDmg, defIsActive ? AttackType.DualAttack : AttackType.Attack);
        if (clash) {
            actions.push(clash);
        }

        /** DisplayHurt 日志：只发守方一条主受击（动作内已含双方 hit），避免二次重复。 */
        if (atkDmg > 0) {
            logs.push(defPl.MakeFieldHurtLog(defIdx, atkDmg));
        }

        attacker.FightEnd();
        defender.FightEnd();

        this.ResolveUnitDeaths(atkPl, atkIdx, defPl, defIdx, logs, actions);
    }

    /**
     * 单条「单位交锋」动作，b1=攻方、b2=守方，hits 同时承载守方受击(攻方 atk)与
     * 攻方被反击(守方 atk)，一次表现一起掉血。
     *
     * 【ActionType 的指定位置】就在本方法 return 对象的 `attackType` 字段：
     *   - AttackType.DualAttack(2) —— 双方都可主动进攻，面对面互撞；
     *   - AttackType.Attack(1)     —— 仅单方可主动进攻，单方面进攻；
     *   - 无阻挡直击主将走 MakeHeroAttackAction 的 AttackType.AttackFace(3)。
     * 伤害 >0 才构建 hit；一个 Action 可含多个 hit。
     */
    protected MakeClashAction(atkPl: BattlePlayer, atkIdx: number, defPl: BattlePlayer, defIdx: number, atkDmg: number, defDmg: number, type: AttackType): Action | undefined {
        let defCard = defPl.GetFieldCard(defIdx);
        let atkCard = atkPl.GetFieldCard(atkIdx);
        if (!defCard || !atkCard) {
            return undefined;
        }
        let hits: Hit[] = [];
        if (atkDmg > 0) {
            hits.push(this.MakeUnitHit(defPl.side, defIdx, atkDmg));
        }
        if (defDmg > 0) {
            hits.push(this.MakeUnitHit(atkPl.side, atkIdx, defDmg));
        }
        return {
            b1: { side: atkPl.side, index: atkIdx },
            b2: { side: defPl.side, index: defIdx },
            attackType: type,
            hits,
            heros: [],
        };
    }

    /**
     * 统一清理双方交手中已阵亡（def<=0）的单位：
     * 先下发一条 `Dead` 动作（b1=死亡格位，客户端据此播放死亡动画并移出场上），
     * 再调用 OnUnitDead 清格 + 进墓地。否则客户端拿不到离场信号，阵亡单位会留到场上下回合才消失。
     */
    protected ResolveUnitDeaths(atkPl: BattlePlayer, atkIdx: number, defPl: BattlePlayer, defIdx: number, logs: BattleLogSimple[], actions: Action[]): void {
        let aU = atkPl.GetUnit(atkIdx);
        if (aU && aU.def <= 0) {
            actions.push(this.MakeRoomStep(AttackType.Dead, { side: atkPl.side, index: atkIdx }));
            atkPl.OnUnitDead(aU);
            this.OnUnitKilled(atkPl, aU, logs, actions);
        }
        let dU = defPl.GetUnit(defIdx);
        if (dU && dU.def <= 0) {
            actions.push(this.MakeRoomStep(AttackType.Dead, { side: defPl.side, index: defIdx }));
            defPl.OnUnitDead(dU);
            this.OnUnitKilled(defPl, dU, logs, actions);
        }
    }

    /**
     * 【扩展点】战斗表现节点（RoundBegin/RoundFight/部署日志）已就绪、逐格结算开始前触发。
     * 默认空实现；子类可在此调用 ResolveSummon 等战斗事件原语。
     */
    protected OnFightBegin(logs: BattleLogSimple[], actions: Action[]): void { }

    /**
     * 【扩展点】某单位阵亡结算完毕（Dead 动作已下发、格位已清空）后立即触发。
     * 默认空实现；「被消灭后召唤」类效果（亡语等）在此调用 ResolveSummon，
     * 表现日志/动作会插入到死亡事件**之后**的结算点，客户端按序播放。
     */
    protected OnUnitKilled(deadPlayer: BattlePlayer, unit: BattleUnit, logs: BattleLogSimple[], actions: Action[]): void { }

    /**
     * 【召唤原语】按规格凭空召唤 `spec.count` 个同型单位：逐个落格（CreateUnit），
     * 再把全部落点汇成**一条** Skill 动作（N 个 hit）+ 逐落点一条 Born 登场表现。
     *
     * 建实体的是 Skill 动作里的 hit（bufferId 决定表现分支、card 决定实体），
     * 客户端链路见 MakeSummonSkillAction 注释；Born 只负责实体建立后的登场动画。
     * 实测（2026-09-24）证伪旧假设：Born 动作携带 isMaterialized=true 的卡快照
     * **不会**让客户端凭空建实体（目标格若无实体，Born 被静默忽略）。
     *
     * @param player 召唤方玩家
     * @param casterIndex 施法挂点格索引；须是客户端该刻有实体的格，否则整条 Skill 动作
     *                    被丢弃（调用方统一传 BattleConst.HERO_INDEX）
     * @param spec 召唤效果与落地卡型（含数量）
     * @returns 实际落格数量
     */
    protected ResolveSummon(player: BattlePlayer, casterIndex: number, spec: SummonSpec, logs: BattleLogSimple[], actions: Action[]): number {
        let landed: number[] = [];
        for (let i = 0; i < spec.count; i++) {
            let index = player.SummonCloneToField(spec);
            if (index < 0) {
                break;
            }
            landed.push(index);
        }
        if (landed.length === 0) {
            return 0;
        }

        /** 一次效果 = 一条 Skill 动作（内含全部 hit）⇒ 客户端只播一次特写 */
        let summonAction = player.MakeSummonSkillAction(casterIndex, spec, landed);
        if (summonAction) {
            actions.push(summonAction);
        }
        /**
         * 特殊召唤的单位逻辑走hit数据
         * 不需要再构建Born动作
         */

        return landed.length;
    }

    /** 返回地块所属列表（index<3 ⇒ 第1行，列=index；3..5 ⇒ 第2行，列=index-3）。 */
    protected ColOf(index: number): number {
        return index % 3;
    }

    /** 与某地块同列的连续两个地块索引（0↔3、1↔4、2↔5）。 */
    protected SameColumnIndices(index: number): number[] {
        return index < 3 ? [index, index + 3] : [index - 3, index];
    }

    /**
     * 在防守方同列中寻找可阻挡攻击方（atkIndex 所在列）的存活单位：
     * 优先正前方同格（index），其次同列另一行。
     */
    protected FindBlocker(defSide: BattlePlayer, atkIndex: number): number {
        let indices = this.SameColumnIndices(atkIndex);
        /** 正前方同格优先 */
        if (indices.includes(atkIndex)) {
            let u = defSide.GetUnit(atkIndex);
            if (u && u.def > 0) {
                return atkIndex;
            }
        }
        /** 同列另一行 */
        for (let oi of indices) {
            if (oi === atkIndex) {
                continue;
            }
            let u = defSide.GetUnit(oi);
            if (u && u.def > 0) {
                return oi;
            }
        }
        return -1;
    }

    /**
     * 无阻挡：攻击方直接攻击对方主将，扣减主将 curHP，并消耗自身 1 次进攻。
     * 每次调用只结算一次主将攻击；连击由调用方(ResolveActiveAttacker)自行循环。
     */
    protected ResolveHeroAttack(atk: BattlePlayer, index: number, def: BattlePlayer, logs: BattleLogSimple[], actions: Action[]): void {
        let attacker = atk.GetCanAttackUnit(index);
        if (!attacker) {
            return;
        }
        attacker.FightBegin();
        let dmg = attacker.atk;
        if (dmg > 0) {
            def.HeroTakeDamage(dmg);
            /** HeroHurt：主将受击表现（血量变化由此驱动）。 */
            logs.push(def.MakeLog(BattleLogType.HeroHurt, BattleLogSide.NullSide, [], [dmg]));
            /** 主将攻击动作（AttackFace，hit.field.index=100 表对方主将，heros 带主将信息）。 */
            let heroAction = this.MakeHeroAttackAction(atk, index, def, dmg);
            if (heroAction) {
                actions.push(heroAction);
            }
        }
        attacker.FightEnd();
        attacker.AttackCount = Math.max(0, attacker.AttackCount - 1);
    }

    /**
     * 构造一条「某格单位受击」的 hit。
     *
     * 真实服务器录像（LUA/Rec/*.rec，见 tools/rec_decode.py）里攻击类 hit 只有
     * `field` + `hurt` 两个字段：卡牌快照走 25007 的格子与 DisplayHurt 日志，
     * **不放 hit.card**。带上 card 会让客户端按 `locationStatus` 走移牌分支，
     * 存活单位被标记成 FIELD_TO_CEMETERY 时表现协程永不结束（整回合卡死）。
     */
    protected MakeUnitHit(side: number, index: number, hurt: number): Hit {
        return {
            field: { side, index },
            hurt: hurt,
        };
    }

    /**
     * 生成一条「单位攻击主将」的动作（AttackType.AttackFace）。
     *
     * 单位无阻挡直接打主将时发 `AttackFace` 动作，对齐客户端主将受击表现；
     * hit.field.index=100 表示对方主将位置（客户端约定），主将不反击（单 hit，HitCount=1）。
     * heros 携带对方主将当前信息（HeroHurt 血量变化据此驱动）。
     * 攻击方已不在场时返回 undefined。
     */
    protected MakeHeroAttackAction(atk: BattlePlayer, atkIdx: number, def: BattlePlayer, dmg: number): Action | undefined {
        if (atk.GetFieldCardUid(atkIdx) <= 0) {
            return undefined;
        }
        let hit: Hit = {
            field: { side: def.side, index: 100 },
            hurt: dmg,
        };
        return {
            b1: { side: atk.side, index: atkIdx },
            b2: { side: def.side, index: 100 },
            attackType: AttackType.AttackFace,
            hits: [hit],
            heros: [def.GetHeroInfo()],
        };
    }

    /** 生成一条房间级战斗表现日志（节点：RoundBegin/RoundFight/RoundEnd/FieldWarn 等）。 */    protected MakeRoomLog(type: BattleLogType, units: BattleLogUnit[] = [], intParams: number[] = []): BattleLogSimple {
        return {
            type: type,
            side: BattleLogSide.NullSide,
            battleParams: [{ units: units, intParams: intParams }],
        };
    }

    /** 生成一条房间级战斗表现动作（节点步骤：RoundBeginStep/FieldWarn/…）。 */
    protected MakeRoomStep(attackType: AttackType, b1?: Battlefield, b2?: Battlefield): Action {
        return {
            b1: b1 ?? undefined,
            b2: b2 ?? undefined,
            attackType: attackType,
            hits: [],
            heros: [],
        };
    }
}

RegisterBattleClasses({ BattleRoom });
