import { BattleStartResponse, ChangeCardRequest, ChangeCardResponse, MESSAGE_ID, RoomType } from "mc-local-share";
import { BattlePlayer } from "./BattlePlayer";
import { Client } from "../net/Client";
import { Logger } from "../core/Logger";
export class BattleRoom {
    /** 房间token */
    public RoomToken: string = '';

    /** 战斗token */
    public BattleToken: string = '';

    public BattlersDict: Record<string, BattlePlayer> = {};

    public Battlers: BattlePlayer[] = [];

    /**
     * 是否可以发送战斗开始的消息
     * 每位玩家准备完毕则+1
     */
    public IsReady: number = 0;

    /**
     * 战斗是否已经开启，避免重复发送战斗开始消息
     */
    private BattleStarted: boolean = false;

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
        NewBallter.side = this.IsReady;

        /**
         * 绑定玩家到字典
         * 必须在初始化战斗信息前绑定，否则异步初始化期间的发牌信息无法回传
         */
        this.BattlersDict[uid] = NewBallter;
        Logger.LogInfo(`BattleRoom[${this.RoomToken}] SetBattler ${uid} ${NewBallter.side}`);

        /**
         * 必须等待战斗信息初始化完成，否则 BattleStart 时主将/手牌仍为空
         */
        try {
            await NewBallter.InitBattleInfo(preset);
        } catch (err) {
            this.IsReady--;
            Logger.LogError(`BattleRoom[${this.RoomToken}] SetBattler ${uid} 初始化战斗信息失败`,err);
            return this.IsReady;
        }

        this.TryBattleStart();
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
     * 战斗开始，构建基础战斗信息并从客户端处进行发送
     */
    BattleStart() {

        let battlers = this.Battlers.map((battler) => {
            return battler.GetBattler();
        });

        let infos = this.Battlers.map((battler) => {
            return battler.GetInfo();
        });

        let info = {
            roomType: RoomType.LADDER_ROOM,
            token: this.BattleToken!,
            roomToken: this.RoomToken!,
            waitingTime: 30,
            enemyQuickBattle: true,
            roundNum: 10,
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
     * 玩家更换手牌
     * @param did 手牌id
     */
    async ChangeCard(uid:string,req:ChangeCardRequest): Promise<ChangeCardResponse> {
        let battler = this.BattlersDict[uid];
        if(!uid||!battler){
            Logger.LogWarn(`BattleRoom[${this.RoomToken}] ChangeCard 未找到玩家 ${uid}`);
            return undefined as any;
        }

        let rep = await battler.ChangeCard(req);
        return rep;
    }
}