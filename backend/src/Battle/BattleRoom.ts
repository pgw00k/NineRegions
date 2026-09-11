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

    SetBattler(preset:any,BattlerCtor: new (preset?: any) => BattlePlayer = BattlePlayer): number {
        let uid = preset.uid||preset.client?.uid||undefined
        if(!uid){
            Logger.LogWarn(`BattleRoom[${this.RoomToken}] SetBattler 未找到uid`,preset);
            return 0;
        }

        this.IsReady++;
        let NewBallter = new BattlerCtor(preset);
        NewBallter.side = this.IsReady;
        NewBallter.InitBattleInfo(preset);

        /**
         * 绑定玩家到字典
         */
        this.BattlersDict[uid] = NewBallter;
        Logger.LogInfo(`BattleRoom[${this.RoomToken}] SetBattler ${uid} ${NewBallter.side}`);

        if (this.IsReady >= 2) {
            /* 战斗开始 */
            this.Battlers = Object.values(this.Battlers);
            this.BattleStart();
        }
        return this.IsReady;
    }

    /**
     * 战斗开始，构建基础战斗信息并从客户端处进行发送
     */
    BattleStart() {

        let battlers = this.Battlers.map((battler) => {
            return battler.GetSimple();
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
            infos: [],
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
    ChangeCard(uid:string,req:ChangeCardRequest):ChangeCardResponse {
        let battler = this.BattlersDict[uid];
        if(!uid||!battler){
            Logger.LogWarn(`BattleRoom[${this.RoomToken}] ChangeCard 未找到玩家 ${uid}`);
            return undefined as any;
        }

        return undefined as any;

    }
}