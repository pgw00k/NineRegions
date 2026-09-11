import { CardSimple_2, MESSAGE_ID } from "mc-local-share";
import { BattleHero } from "./BattleHero";
import { DeckService } from "../database/service/Deck.service";
import { CardService } from "../database/service/Card.service";
import { Client } from "../net/Client";
import { Logger } from "../core/Logger";

export class BattlePlayer {

    /** 玩家绑定的客户端
     * 用于处理战斗信息
     */
    public client: Client;

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
            Logger.LogInfo(`BattlePlayer BindClient [${this.client.uid}]`);
        }
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
        this.DeckCards = (await CardService.Instance.GetCards(info.cards));
        this.DeckCards.forEach(card => {
            card.uid = this.side;
        });

        /**
         * 初始化主将信息
         **/
        this.hero = new BattleHero({
            heroID: info.hero,
            heroSkillID: info.skill,
        });

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

    GetSimple() {
        return {
            heroInfo: this.hero,
            hand: this.hand,
            battleFields: [],
            deckIDs: this.DeckIDs,
            cemeteryIDs: this.CemeteryIDs,
            equipIDs: this.EquipIDs,
        }
    }

    SendMessage(id: MESSAGE_ID, data: any) {
        this.client.PushMessage(id, data);
    }
}