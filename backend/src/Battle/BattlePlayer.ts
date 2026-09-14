import { CardSimple_2, MESSAGE_ID } from "mc-local-share";
import { BattleHero } from "./BattleHero";
import { DeckService } from "../database/service/Deck.service";
import { CardService } from "../database/service/Card.service";
import { Client } from "../net/Client";
import { Logger } from "../core/Logger";
import { PlayerService } from "../database/service/Player.service";
import { PlayerInfoService } from "../database/service/PlayerInfo.service";

export class BattlePlayer {

    /** 玩家绑定的客户端
     * 用于处理战斗信息
     */
    public client: Client;

    /** 玩家UID，和Player对应 */
    public uid: string = "0";

    /** 玩家名称 */
    public name: string = "无名少侠";

    public ladderLv: number = 1;
    public ladderStar: number = 0;
    public meritPoint: number = 0;

    /** 属性，这个属性是记录在卡组中的，所以会在初始化战斗信息之后才设置
     * 默认设置为水（1）
     */
    public job: number = 1;

    /** 卡背
     * 默认设置为50001
     * 也是记录在卡组信息中的
     */
    public carBack: number = 50001;

    /** 玩家ID */
    public side: number = 1;
    /** 主将 */
    public hero: BattleHero;
    /** 手牌 */
    public hand: CardSimple_2[] = [];
    /** 剩余牌组 */
    public DeckCards: CardSimple_2[] = [];
    /** 牌组ID */
    public DeckIDs: number[] = [];

    /** 墓地牌ID */
    public CemeteryIDs: number[] = [];

    /** 装备ID */
    public EquipIDs: number[] = [];

    constructor(preset?: any) {
        /**
         * 有客户端信息的绑定客户端信息
         **/
        if (preset && preset.client) {
            this.client = preset.client;
            this.uid = preset.uid || preset.client.uid || undefined;
            this.InitPlayerInfo();
        }
    }

    async InitPlayerInfo() {
        if (!this.uid) {
            Logger.LogWarn(`BattlePlayer BindClient [${this.client.uid}] faild:Not set uid`);
            return;
        }
        let playerSimple = await PlayerService.Instance.GetPlayerByID(this.uid);
        if (!playerSimple) {
            Logger.LogInfo(`BattlePlayer BindClient [${this.client.uid}] faild:Not found player`);
            return;
        }
        this.name = playerSimple.name ?? this.name;

        let playerInfo = await PlayerInfoService.Instance.GetPlayerInfoByID(this.uid, {
            ladderLv: true,
            ladderStar: true,
            meritPoint: true,
        });
        if (!playerInfo) {
            Logger.LogInfo(`BattlePlayer BindClient [${this.client.uid}] faild:Not found player info`);
            return;
        }

        this.ladderLv = playerInfo.ladderLv;
        this.ladderStar = playerInfo.ladderStar;
        this.meritPoint = playerInfo.meritPoint;

        Logger.LogInfo(`BattlePlayer BindClient [${this.client.uid}] Name:${this.name}`);
    }

    /**
     * 初始化战斗信息
     * @param preset 至少要传入 did 字段作为卡组信息
     */
    async InitBattleInfo(preset: any) {

        this.DeckIDs.push(preset.did);
        // 从数据库读取牌组ID，构筑基础的战斗牌组
        let info = (await DeckService.Instance.GetById(preset.did))!;
        // 不做空校验了，认为其必定存在
        let cards = (await CardService.Instance.GetCards(info.cards));
        cards.forEach(card => {
            this.DeckCards.push({
                uid: this.side,
                cid: Number(card.cid),
                cost: Number(card.cost),
                isMaterialized: false,
                abilitie:{
                    skillId: card.skillId,
                    passiveSkillId: card.passiveSkillId,
                    skillExpander: [],
                    atk: card.atk,
                    curDef: card.def,
                    maxDef: 99,
                    isPrepare: false,
                    flyLayer: card.FlyLayer,
                    auraSkillId: card.auraSkillId,
                },
            });
        });

        /**
         * 初始化主将信息
         **/
        this.hero = new BattleHero({
            side: this.side,
            heroID: info.hero,
            heroSkillID: info.skill,
        });

        /**
         * 设置卡组属性信息
         **/
        this.job = info.job;
        this.carBack = info.cardBack;

        // 初始手牌
        this.DrawCard(5);
    }

    /**
     * 抽牌
     */
    DrawCard(count: number = 1) {
        if (this.DeckCards.length == 0) {
            // 此时应该直接判负
            return;
        }
        // 抽牌
        for (let i = 0; i < count; i++) {
            let card = this.DeckCards.shift()!;
            this.hand.push(card);
        }
    }

    SendMessage(id: MESSAGE_ID, data: any) {
        this.client.PushMessage(id, data);
    }

    GetSimple() {
        return {
            heroInfo: this.hero.GetInfo(),
            hand: this.hand,
            battleFields: [],
            deckIDs: this.DeckIDs,
            cemeteryIDs: this.CemeteryIDs,
            equipIDs: this.EquipIDs,
        }
    }

    GetSimpleInfo() {
        return {
            side: this.side,
            name: this.name,
            hero: this.hero.heroID,
            job: this.job,
            carBack: this.carBack,
            ladderLv: this.ladderLv,
            ladderStar: this.ladderStar,
            meritPoint: this.meritPoint,
            playerTitle: [130024],

            //skin:1
            //gildingUse:[]
        }
    }
}