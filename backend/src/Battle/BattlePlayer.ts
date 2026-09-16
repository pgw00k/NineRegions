import { Action, AttackType, BattleLogParams, BattleLogSide, BattleLogSimple, BattleLogType, BattleLogUnit, BattleFieldSimple, BattlerInfoSimple, BattlerSimple, CardSimple_2, ChangeCardRequest, ChangeCardResponse, DeployActionSimple, HeroInfo, Hit, LocationStatus, MESSAGE_ID, ActionType, Battlefield } from "mc-local-share";
import { BattleHero } from "./BattleHero";
import { BattleConst } from "./BattleConst";
import { DeckService } from "../database/service/Deck.service";
import { CardService } from "../database/service/Card.service";
import { Client } from "../net/Client";
import { Logger } from "../core/Logger";
import { PlayerService } from "../database/service/Player.service";
import { PlayerInfoService } from "../database/service/PlayerInfo.service";
import { Card } from "../database/data/Card";
import { BattleField } from "./BattleField";
import { BattleCard } from "./BattleCard";

export class BattlePlayer {

    /** 玩家绑定的客户端
     * 用于处理战斗信息
     */
    public client: Client;

    /** 玩家UID，和Player对应 */
    public uid: string = "1";

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
    public cardBack: number = 50001;

    /** 玩家阵营
     */
    public side: number = 1;
    /** 主将 */
    public hero: BattleHero;

    /** 
     * 对应玩家的所有卡牌，用来检索和记录数据
     * <CardUID, BattleCard>
     */
    public AllCards: Record<number, BattleCard> = {};

    /** 初始化是否完成（InitBattleInfo 成功结束后置 true）。
     * 用于让 BattleRoom 在集齐双方时等待所有参战者的战斗信息就绪，避免异步初始化的竞态。 */
    public hasInited: boolean = false;

    /** 
     * UID 是运行时生成的单卡ID，每张卡不同
     * ID 是卡牌的牌型ID，用来进行效果处理
     */

    /** 手牌UID列表
     * 手牌记录的是UID
     */
    public HandUIDs: number[] = [];
    /** 
     * 牌组也用UID
     */
    public DeckUIDs: number[] = [];
    /** 墓地牌 */
    public CemeteryIDs: number[] = [];
    /** 装备ID */
    public EquipIDs: number[] = [];

    /** 战场：6 个格子，索引 0..5，与 FIELD_SIZE 对应 */
    public BattleFields: Record<number, BattleField> = {};

    /**
     * 本轮新部署（翻开/召唤）上场的卡 UID 集合。
     *
     * 用于结算时区分「本回合刚翻开」与「早已在场」的单位：
     *   - 新 IN 该集合 → 走 DisplayBorn（召唤登场）；
     *   - 不在该集合 → 走攻击动作（已在场单位，不再重复召唤）。
     * 每轮部署阶段开始时由 BeginDeployment() 清空，即集合永远只属于「当前轮」。
     */
    public NewBornUIDs: number[] = [];

    /**
     * 本轮部署阶段开始：清空「本轮新登场」标记，供 SimulateFight 区分 Born 与 Attack。
     * 必须在下发 25005（部署开始）之前调用，否则上一轮的标记会污染本轮结算。
     */
    BeginDeployment(): void {
        this.NewBornUIDs = [];
    }

    constructor(preset?: any) {
        /**
         * 有客户端信息的绑定客户端信息
         **/
        if (preset && preset.client) {
            this.client = preset.client;
        }
        this.uid = preset.uid || preset.client.uid || undefined;
        this.InitPlayerInfo();
    }

    async InitPlayerInfo() {
        if (!this.uid) {
            Logger.LogWarn(`BattlePlayer BindClient faild:Not set uid`);
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

        Logger.LogInfo(`BattlePlayer BindClient [${this.uid}] Name:${this.name}`);
    }

    /**
     * 初始化战斗信息
     * @param preset 至少要传入 did 字段作为卡组信息
     */
    async InitBattleInfo(preset: any) {

        // 从数据库读取牌组ID，构筑基础的战斗牌组
        let info = (await DeckService.Instance.GetById(preset.did))!;
        // 不做空校验了，认为其必定存在
        let cards = (await CardService.Instance.GetCards(info.cards));

        let cardDict: Record<number, Card> = {};
        cards.forEach((card) => {
            cardDict[Number(card.cid)] = card;
        });

        info.cards.forEach((cidKey, index) => {
            let cardRaw = cardDict[cidKey];
            let cardUid = this.side * 1000 + index + 1;

            let cid = Number(cidKey);

            let raw: CardSimple_2 = {
                /**
                 * 计算单张牌的UUID，玩家序号*1000+牌序号+1，确保每个牌的UUID都是唯一的
                 * 玩家1从1001开始，玩家2从2001开始
                 */
                uid: this.side * 1000 + index + 1,
                cid: cid,
                cost: cardRaw.cost,
                isMaterialized: false,
                abilitie: {
                    skillId: cardRaw.skillId,
                    passiveSkillId: cardRaw.passiveSkillId,
                    skillExpander: [],
                    atk: cardRaw.atk,
                    /**
                     * 防御值其实就是HP，应该是cur>max UI会显示绿色，cur<max UI会显示红色
                     */
                    curDef: cardRaw.def,
                    maxDef: cardRaw.def,
                    isPrepare: false,
                    flyLayer: cardRaw.FlyLayer,
                    auraSkillId: cardRaw.auraSkillId,
                },
            }
            this.AllCards[cardUid] = new BattleCard(cid, raw);
            this.DeckUIDs.push(cardUid);
        });

        /**
         * 初始化主将信息
         **/
        this.hero = new BattleHero({
            side: this.side,
            heroID: info.hero,
            heroSkillID: Number(info.skill),
            curHP: BattleConst.INIT_HP,
            maxHP: BattleConst.INIT_HP,
            curMana: BattleConst.INIT_MANA,
            maxMana: BattleConst.INIT_MANA,
        });

        /**
         * 设置卡组属性信息
         **/
        this.job = info.job;
        this.cardBack = info.cardBack;

        this.ShuffleDeck();

        /**
         * 初始化战场地块
         * 每位玩家有6个地块
         */
        this.BattleFields = {};
        for (let i = 0; i < BattleConst.FIELD_SIZE; i++) {
            this.BattleFields[i] = new BattleField();
        }

        // 初始手牌
        this.DrawCard(BattleConst.INIT_HAND);

        // 标记初始化完成，供房间判断是否可开战
        this.hasInited = true;

        Logger.LogInfo(`BattlePlayer InitBattleInfo [${this.uid}]`);
    }


    /**
     * 洗牌
     */
    ShuffleDeck(): void {
        for (let i = this.DeckUIDs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.DeckUIDs[i], this.DeckUIDs[j]] = [this.DeckUIDs[j], this.DeckUIDs[i]];
        }
    }

    /**
     * 抽牌
     */
    DrawCard(count: number = 1): number[] {
        let cards: number[] = [];
        if (this.DeckUIDs.length == 0) {
            // 此时应该直接判负
            return cards;
        }
        // 抽牌
        for (let i = 0; i < count; i++) {
            let cardUid = this.DeckUIDs.shift()!;
            this.HandUIDs.push(cardUid);
            cards.push(cardUid);
        }
        return cards;
    }

    SendMessage(id: MESSAGE_ID, data: any) {
        this.client.PushMessage(id, data);
    }

    GetBattler(): BattlerSimple {
        let heroInfo: HeroInfo = {
            ...this.hero.GetInfo(),
            side: this.side,
            handCount: this.HandUIDs.length,
            deckCount: this.DeckUIDs.length,
            cemeteryCount: this.CemeteryIDs.length,
        }
        return {
            heroInfo: heroInfo,
            hand: this.HandUIDs.map((uid) => this.AllCards[uid].Current),
            battleFields: Object.values(this.BattleFields).map((field, index) => {

                let fieldSimple:BattleFieldSimple = {
                    index: Number(index),
                    ...field.GetSimple(),
                }

                if(fieldSimple.hasCard) {
                    fieldSimple.card = this.AllCards[field.cardUid].Current;
                }

                return fieldSimple;
            }),
            deckIDs: this.DeckUIDs.map((uid) => this.AllCards[uid].cid),
            cemeteryIDs: this.CemeteryIDs,
            equipIDs: this.EquipIDs,
        }
    }

    GetInfo(): BattlerInfoSimple {
        return {
            side: this.side,
            name: this.name,
            hero: this.hero.heroID,
            job: this.job,
            cardBack: this.cardBack,
            ladderLv: this.ladderLv,
            ladderStar: this.ladderStar,
            meritPoint: this.meritPoint,
            playerTitle: [130024],
            // skin:1,
            gildingUse: []
        }
    }

    /**
     * 换手牌
     */
    ChangeCard(req: ChangeCardRequest): ChangeCardResponse {
        req.cardUids.forEach((uid) => {
            let uidIndex = this.HandUIDs.findIndex((u) => u === uid);
            if (uidIndex >= 0) {
                this.HandUIDs.splice(uidIndex, 1);
                this.DeckUIDs.push(uid);
            }
        });
        let cards = this.DrawCard(req.cardUids.length);
        this.ShuffleDeck();
        return {
            changedCards: cards.map((uid) => this.AllCards[uid].Current),
            quickBattle: req.quickBattle,
            actions: [],
            selectedCards: req.cardUids,
            logs: [{
                type: BattleLogType.NullType,
                side: this.side,
                battleParams: [],
            }],
        }
    }

    /**
     * 应用布阵动作（25006 携带的 DeployActionSimple[]）。
     * 更新服务端记录的战场情况
     * @param actions 客户端提交的布阵动作
     */
    ApplyDeploy(actions: DeployActionSimple[]): void {
        actions.forEach((action) => {
            Logger.LogInfo(`BattlePlayer[${this.uid}] ApplyDeploy`, action);

            /**
             * 先不做校验，直接认定客户端传递过来的数据均合法
             * */
            let bid = action.index
            let cardUid = action.cardUid;

            switch (action.type) {
                case ActionType.PUT:
                    /**
                     * PUT=1：把牌打出到目标地块
                     */
                    let slot = this.BattleFields[bid];
                    if (!slot || slot.hasCard) {
                        // 目标地块已占用
                        Logger.LogWarn(`BattlePlayer[${this.uid}] PUT=${bid} 已占用`);
                        return;
                    }
                    slot.cardUid = cardUid;

                    /**
                     * 从手牌中移除这张牌
                     */
                    this.HandUIDs.splice(this.HandUIDs.indexOf(cardUid), 1);

                    /**
                     * 记录为本轮新部署的卡（结算时走 DisplayBorn 召唤登场）
                     */
                    if (cardUid && !this.NewBornUIDs.includes(cardUid)) {
                        this.NewBornUIDs.push(cardUid);
                    }
                    break;
                case ActionType.PUSH:
                    /**
                     * PUSH=2：牌被推挤到了目标地块
                     * 参数field 中记录了被推过来的牌原来所在的地块信息
                     * 此时cardUid 为0，需要在服务器端进行处理
                     */
                    let origSlotID = action.field?.index || -1;
                    let origSlot = this.BattleFields[origSlotID];
                    if (!origSlot) {
                        Logger.LogError(`BattlePlayer[${this.uid}] PUSH=${bid} 未找到原地块`);
                        return;
                    }
                    origSlot.cardUid = 0;
                    this.BattleFields[bid].cardUid = cardUid;
                    break;
                default:
                    break;
            }
        });
    }

    /**
     * 构造一条战斗表现日志。
     *
     * @param type 日志类型（见 BattleLogType）
     * @param side 日志归属方（见 BattleLogSide）
     * @param units 日志单元（卡牌/主将快照）
     * @param intParams 附加整数参数
     */
    MakeLog(type: BattleLogType, side: BattleLogSide, units: BattleLogUnit[] = [], intParams: number[] = []): BattleLogSimple {
        let params: BattleLogParams = {
            units: units,
            intParams: intParams,
        };
        return {
            type: type,
            side: side,
            battleParams: [params],
        }
    }

    /**
     * 生成一条「战场上的卡牌」日志单元。
     */
    MakeLogUnit(side: number, field: number, cid: number, atk: number, def: number, maxDef: number): BattleLogUnit {
        return {
            side: side,
            field: field,
            cid: cid,
            atk: atk,
            def: def,
            maxDef: maxDef,
            isMaterialized: false,
            activeSkills: [],
            passiveSkills: [],
        };
    }

    /**
     * 生成本方战场上的日志单元列表。
     */
    GetFieldUnits(): BattleLogUnit[] {
        let units: BattleLogUnit[] = [];

        Object.entries(this.BattleFields).forEach(([index, slot]) => {
            if (!slot.hasCard || !slot.cardUid) {
                return;
            }

            let card = this.AllCards[slot.cardUid].Current;
            let abilitie = card.abilitie;
            units.push(this.MakeLogUnit(
                this.side,
                Number(index),
                card.cid ?? 0,
                abilitie?.atk ?? 0,
                abilitie?.curDef ?? 0,
                abilitie?.maxDef ?? 0,
            ));

        });

        return units;
    }

    // ===========================================================================
    // 下述各方法均为「单实例」原语/访问器：只读取/操作**自己**的状态，
    // 不引用、也不感知其他 BattlePlayer。跨玩家结算编排统一放在 BattleRoom。
    // ===========================================================================

    /** 读取自己某个地块上的卡（单实例访问器，不感知对手）。 */
    GetFieldCard(index: number): CardSimple_2 | undefined {
        let slot = this.BattleFields[index];
        if (!slot || !slot.hasCard || !slot.cardUid) {
            return undefined;
        }
        return this.AllCards[slot.cardUid].Current;
    }

    /** 读取自己某个地块上的卡 UID（无卡返回 0）。 */
    GetFieldCardUid(index: number): number {
        let slot = this.BattleFields[index];
        return slot && slot.hasCard ? slot.cardUid : 0;
    }

    /** 读取某格单位的攻击力。 */
    GetFieldAtk(index: number): number {
        return this.GetFieldCard(index)?.abilitie?.atk ?? 0;
    }

    /** 读取某格单位的飞行层数（>0 视为飞行单位）。 */
    GetFlyLayer(index: number): number {
        return this.GetFieldCard(index)?.abilitie?.flyLayer ?? 0;
    }

    /** 某卡是否为本轮新部署（翻开/召唤）。 */
    IsNewBornCard(cardUid: number): boolean {
        return this.NewBornUIDs.includes(cardUid);
    }

    /**
     * 自己某个地块的单位是否「可行动」：在场、非本轮新部署、且尚未阵亡（curDef>0）。
     * 用于让 BattleRoom 判断该格是否产生攻击。
     */
    CanActFieldUnit(index: number): boolean {
        let card = this.GetFieldCard(index);
        if (!card) {
            return false;
        }
        if (this.IsNewBornCard(this.GetFieldCardUid(index))) {
            return false;
        }
        return (card.abilitie?.curDef ?? 0) > 0;
    }

    /** 生成自己某个地块单位的战斗日志单元（BattleLogUnit）；无卡返回 undefined。 */
    GetFieldUnitLog(index: number): BattleLogUnit | undefined {
        let card = this.GetFieldCard(index);
        if (!card) {
            return undefined;
        }
        let abilitie = card.abilitie;
        return this.MakeLogUnit(
            this.side, index, card.cid ?? 0,
            abilitie?.atk ?? 0,
            abilitie?.curDef ?? 0,
            abilitie?.maxDef ?? 0,
        );
    }

    /**
     * 自己某个地块的单位受击：扣减 curDef；归零标记阵亡并移出战场、进入墓地。
     * @returns 受击后 curDef
     */
    DealFieldDamage(index: number, dmg: number): number {
        let slot = this.BattleFields[index];
        let card = this.AllCards[slot.cardUid].Current;
        let cur = card.abilitie?.curDef ?? 0;
        let next = Math.max(0, cur - dmg);
        if (card.abilitie) {
            card.abilitie.curDef = next;
        }
        if (next <= 0) {
            slot.cardUid = 0;
            this.CemeteryIDs.push(card.uid ?? 0);
        }
        return next;
    }

    /**
     * 自己主将受击：扣减 curHP（下限 0）。
     * @returns 受击后 curHP
     */
    HeroTakeDamage(dmg: number): number {
        this.hero.curHP = Math.max(0, (this.hero.curHP ?? 0) - dmg);
        return this.hero.curHP;
    }

    /** 读取自己主将信息（单实例访问器）。 */
    GetHeroInfo(): HeroInfo {
        return this.hero.GetInfo();
    }

    /** 生成自己某个地块单位受击的 DisplayHurt 日志。 */
    MakeFieldHurtLog(index: number, dmg: number): BattleLogSimple {
        let unit = this.GetFieldUnitLog(index);
        return this.MakeLog(BattleLogType.DisplayHurt, BattleLogSide.NullSide, unit ? [unit] : [], [dmg]);
    }

    /** 生成自己某个地块单位翻面/召唤登场的 DisplayBorn 日志；本格无单位时返回 undefined。 */
    MakeBornLog(index: number): BattleLogSimple | undefined {
        let unit = this.GetFieldUnitLog(index);
        if (!unit) {
            return undefined;
        }
        return this.MakeLog(BattleLogType.DisplayBorn, BattleLogSide.NullSide, [unit]);
    }

    /**
     * 生成一条战斗表现动作（Action）。
     *
     * @param attackType 动画类型（节点型 RoundBeginStep / RoundFightStep / RoundEndStep，
     *                   或实体型 FieldWarn / Born / Attack 等）
     * @param side 动作归属阵营（1 / 2），仅实体动作需要；节点动作传 undefined
     * @param index 目标格 index
     */
    MakeAction(attackType: AttackType, side?: number, index?: number): Action {
        return {
            b1: side !== undefined && index !== undefined ? { side, index } : undefined,
            attackType,
            hits: [],
            heros: [],
        };
    }

    /**
     * 生成一条我方「卡牌翻面/召唤上场」动作（AttackType.Born），单实例方法。
     *
     * 客户端据此在 b1 指定格子播放卡面翻起、角色上场的动画。hits[0].card 携带该卡
     * 的 uid/cid/费用/物质化与 locationStatus=HAND_TO_FIELD(13)，hits[0].abilitie 携带
     * 身上已生效的攻防与异能，供客户端重建该格卡牌的表现。
     * @param index 自己某块地块的索引
     */
    MakeBornAction(index: number): Action | undefined {
        let card = this.GetFieldCard(index);
        if (!card) {
            return undefined;
        }
        let abilitie = card.abilitie;
        let hit: Hit = {
            field: { side: this.side, index },
            card: {
                uid: card.uid ?? 0,
                cid: card.cid ?? 0,
                cost: card.cost ?? 0,
                isMaterialized: card.isMaterialized ?? false,
                locationStatus: LocationStatus.HAND_TO_FIELD,
            },
            abilitie: {
                skillId: [...(abilitie?.skillId ?? [])],
                passiveSkillId: [...(abilitie?.passiveSkillId ?? [])],
                skillExpander: (abilitie?.skillExpander ?? []).map((e) => ({ ...e })),
                atk: abilitie?.atk ?? 0,
                curDef: abilitie?.curDef ?? 0,
                maxDef: abilitie?.maxDef ?? 0,
                isPrepare: abilitie?.isPrepare ?? false,
                flyLayer: abilitie?.flyLayer ?? 0,
                auraSkillId: [...(abilitie?.auraSkillId ?? [])],
            },
            attacker: { side: this.side, index },
        };
        return {
            b1: { side: this.side, index },
            attackType: AttackType.Born,
            hits: [hit],
            heros: [],
        };
    }
}
