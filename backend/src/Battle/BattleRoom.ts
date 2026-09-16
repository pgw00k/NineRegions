import {
    Action,
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
    MESSAGE_ID,
    RoomType,
} from "mc-local-share";
import { BattlePlayer } from "./BattlePlayer";
import { Client } from "../net/Client";
import { Logger } from "../core/Logger";
import { BattleConst } from "./BattleConst";

/**
 * 战斗房间 —— 严格按客户端历史日志（JYLog_Backup）还原的回合驱动。
 *
 * 服务端视角下的完整交互闭环（2 起手 → 换牌 → 抽牌 → 部署 → 战斗 → 结算 → 下一轮）：
 *
 *   C2S 25001 BATTLE_READY_REQ      →（房间集齐 2 人）
 *   S2C 25002 BATTLE_START_REP      进入 CHANGE（换牌）阶段
 *   C2S 25003 CHANGE_CARD_REQ       玩家提交换牌
 *   S2C 25004 CHANGE_CARD_REP       换牌应答（logs: PlayGame/RoundEnter）
 *   S2C 25010 DEAL_STEP_REP         抽牌步骤（roundNum + logs: RoundEnter/DisplayGetCard）
 *   S2C 25005 DEPLOYMENT_START_REP  部署开始（battlers 快照 + Snapshot1 日志）
 *   C2S 25006 DEPLOYMENT_COMPLETE_REQ 玩家提交布阵
 *   S2C 25007 FIGHT_START_REP       战斗开始（battlers 快照 + Snapshot2 日志）
 *   S2C 25011 FIGHT_STEP_REP        战斗表现（RoundBegin/RoundFight/伤害/…/RoundEnd）
 *   C2S 25012 SHOW_END_REQ          客户端播完表现
 *   → 回到 S2C 25010 + 25005 开始下一轮（直到 roundNum 打满或主将阵亡）
 *   S2C 25008 BATTLE_END_REP        战斗结束（winInfo / roundNum / quit）
 */
export class BattleRoom {
    /** 房间token */
    public RoomToken: string = '';

    /** 战斗token */
    public BattleToken: string = '';

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
     * 本轮是否已经有客户端发来 25012（播完表现）。
     *
     * 防守场景：真人客户端与机器人都会发 25012，后到的那条若不拦截，
     * 会把已经推进过的回合再推进一次，导致 DEAL_STEP/DEPLOYMENT_START 重复。
     */
    protected ShowEndDone: boolean = false;

    constructor(preset:any) {
        Object.assign(this, preset);
    }

    async SetBattler(preset:any,BattlerCtor: new (preset?: any) => BattlePlayer = BattlePlayer): Promise<number> {
        let uid = preset.uid||preset.client?.uid||undefined
        if(!uid){
            Logger.LogWarn(`BattleRoom[${this.RoomToken}] SetBattler 未找到uid`,preset);
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
            Logger.LogError(`BattleRoom[${this.RoomToken}] SetBattler ${uid} 初始化战斗信息失败`,err);
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
        this.Battlers = Object.values(this.BattlersDict).sort((a,b) => a.side - b.side);
        this.BattleStart();
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
            waitingTime: 30,
            enemyQuickBattle: true,
            roundNum: this.MaxRoundNum,
            /** 为了模拟方便，让2号玩家先开始，1号是机器人 */
            side: 2,
            actions: [],
            infos: infos,
            battlers: battlers,
        }

        Logger.LogInfo(`BattleRoom[${this.RoomToken}] 发送战斗开始信息：${MESSAGE_ID.BATTLE_START_REP}`, info);
        for (let battler of this.Battlers) {
            battler.SendMessage(MESSAGE_ID.BATTLE_START_REP,info);
        }
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
    async ChangeCard(uid:string,req:ChangeCardRequest): Promise<ChangeCardResponse> {
        let battler = this.BattlersDict[uid];
        if(!uid||!battler){
            Logger.LogWarn(`BattleRoom[${this.RoomToken}] ChangeCard 未找到玩家 ${uid}`);
            return undefined as any;
        }

        let rep = await battler.ChangeCard(req);

        /**
         * 先下发 25004：换牌阶段的应答必须早于 25010 / 25005，
         * 否则客户端状态机不会从 ChangeCard 迁移到 Deal（详见方法头注释）。
         */
        Logger.LogInfo(`BattleRoom[${this.RoomToken}] 换牌应答：${MESSAGE_ID.CHANGE_CARD_REP}`);
        battler.SendMessage(MESSAGE_ID.CHANGE_CARD_REP, rep);

        /**
         * 再广播 25010 / 25005（房间级，双方都要收到）。
         */
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
            let logs = [
                battler.MakeLog(BattleLogType.RoundEnter, BattleLogSide.NullSide),
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
         * 进入部署阶段前，双方各抽 1 张（日志中每轮 DrawCard 一次）。
         * 首轮已在 InitBattleInfo 抽过 5 张起手，这里对应「回合开始抽牌」。
         */
        let dealCached: number[] = [];
        for (let battler of this.Battlers) {
            let drawn = battler.DrawCard(BattleConst.DRAW_PER_ROUND);
            for (let cardUid of drawn) {
                if (cardUid) dealCached.push(cardUid);
            }
        }

        /**
         * 复位本轮状态**必须在下发 25005 之前**完成。
         *
         * SendMessage 是同步调用：真实客户端/回放机器人会在收到 25005 的当场
         * 立刻回一个 25006。若复位放在广播之后，这次提交会被 DeployCompleted={}
         * 直接抹掉，表现为「本轮部署阶段永远等不到开打」。
         */
        this.DeployCompleted = {};
        this.FightTriggered = false;
        this.ShowEndDone = false;

        for (let battler of this.Battlers) {
            let battlers = this.Battlers.map((b) => b.GetBattler());
            let logs = [
                battler.MakeLog(BattleLogType.Snapshot1, BattleLogSide.SideA),
                battler.MakeLog(BattleLogType.Snapshot1, BattleLogSide.SideB),
            ];

            let rep: DeploymentStartResponse = {
                waitingTime: 30,
                battlers: battlers,
                logs: logs,
                penaltyTimes: 0,
                dealCached: dealCached,
            };

            Logger.LogInfo(`BattleRoom[${this.RoomToken}] 发送部署开始：${MESSAGE_ID.DEPLOYMENT_START_REP}`, rep);
            battler.SendMessage(MESSAGE_ID.DEPLOYMENT_START_REP, rep);
        }

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
    async DeploymentComplete(uid:string, req:DeploymentCompleteRequest): Promise<void> {
        let battler = this.BattlersDict[uid];
        if(!battler){
            Logger.LogWarn(`BattleRoom[${this.RoomToken}] DeploymentComplete 未找到玩家 ${uid}`);
            return;
        }

        battler.ApplyDeploy(req.action ?? []);
        this.DeployCompleted[battler.side] = true;
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
        this.FightStart();
        this.FightStep();
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
        /* 进入战斗结算，回合号推进（CHANGE_CARD_REP=1 → FIGHT_*=2） */
        this.RoundNum += 1;

        for (let battler of this.Battlers) {
            let battlers = this.Battlers.map((b) => b.GetBattler());
            let logs: BattleLogSimple[] = [];

            /**
             * 第 2 回合起，FieldWarn 逐格翻开前会先出现 DisplayMove。
             * （真实日志中第 2/4/6/9/14 回合的 25007 都有一条 SideA 的 DisplayMove）
             */
            if (this.RoundNum > 2) {
                let sideA = this.Battlers[0];
                if (sideA) {
                    logs.push(sideA.MakeLog(BattleLogType.DisplayMove, BattleLogSide.SideA, [], [sideA.side]));
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

            Logger.LogInfo(`BattleRoom[${this.RoomToken}] 发送战斗步骤：${MESSAGE_ID.FIGHT_STEP_REP} round=${this.RoundNum} logs=${logs.length} actions=${actions.length}`);
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
    async ShowEnd(uid:string): Promise<void> {
        if (this.BattleEnded) {
            Logger.LogWarn(`BattleRoom[${this.RoomToken}] ShowEnd 战斗已结束，忽略 ${uid}`);
            return;
        }

        /**
         * 本轮只认第一条 25012。
         *
         * 真人与机器人都会发 25012，且机器人是延迟发送的；若两条都放行，
         * 后到的那条会把已经推进过的回合再推进一次，表现为
         * DEAL_STEP_REP / DEPLOYMENT_START_REP 成对重复。
         */
        if (this.ShowEndDone) {
            Logger.LogWarn(`BattleRoom[${this.RoomToken}] ${uid} 25012 到达时本轮已推进，忽略`);
            return;
        }
        this.ShowEndDone = true;

        /**
         * 胜负判定：任一方主将 HP <= 0，或打满最大回合数
         */
        let dead = this.Battlers.filter((b) => b.hero.curHP <= 0);
        if (dead.length > 0 || this.RoundNum >= this.MaxRoundNum * 2) {
            this.BattleEnd();
            return;
        }

        /**
         * 下一轮：回合号推进后在 DEAL_STEP / FIGHT_START 中体现
         */
        this.RoundNum += 1;
        Logger.LogInfo(`BattleRoom[${this.RoomToken}] ${uid} 播完表现，进入下一轮 round=${this.RoundNum}`);
        this.DealStep();
        this.DeploymentStart();
    }

    /**
     * 【S2C 25008】战斗结束。
     *
     * BattleEndResponse：{ winInfo, roundNum, quit }。
     * winInfo 以「接收者视角」给出：1 表示胜利，2 表示失败（与 BATTLE_START_REP.side 对应）。
     */
    protected BattleEnd() {
        this.BattleEnded = true;

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
    }

    /**
     * 战斗结算核心。
     *
     * 当前仅还原「表现日志与动画动作的生成顺序」，不包含真实卡牌技能数值计算：
     *   RoundBegin → RoundFight → [FieldWarn → DisplayBorn]×逐格 → RoundEnd
     * 每个实体动作同时产出对应 logs（BattleLogSimple）与 actions（Action），
     * 后续可在此基础上接入卡牌技能/Aura/碰撞等具体规则（见 BattlePlayer.SimulateFight）。
     */
    protected SimulateFight() {
        return this.Battlers[0].SimulateFight(this.Battlers, this.RoundNum);
    }
}
