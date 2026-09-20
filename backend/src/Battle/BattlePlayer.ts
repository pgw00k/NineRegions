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
import { BattleUnit } from "./BattleUnit";
import { IBattleRound } from "./IBattleState";

export class BattlePlayer implements IBattleRound {

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
    public CemeteryUIDs: number[] = [];
    /** 装备ID */
    public EquipIDs: number[] = [];

    /** 战场：6 个格子，索引 0..5，与 FIELD_SIZE 对应 */
    public BattleFields: Record<number, BattleField> = {};

    /** 单位列表
     * 6个地块，最多6个单位
     */
    public Units: Record<number, BattleUnit> = {};

    /**
     * 本轮部署阶段内产生的「待播发」战斗日志（如部署时立即消耗的表现）。
     * 由 ApplyDeploy 追加、BeginDeployment 清空，供 BattleRoom.SimulateFight 播发。
     */
    public DeployLogs: BattleLogSimple[] = [];

    /** 本轮部署阶段内产生的「待播发」布阵动作
     * 需要下发给客户端播放对应的布阵效果
     */
    public S2CDeployActions:Action[] = [];

    /**
     * 本轮部署阶段开始：清空「本轮待播发日志」。
     * 必须在下发 25005（部署开始）之前调用，否则上一轮的日志会污染本轮结算。
     */
    BeginDeployment(): void {
        this.DeployLogs = [];
    }

    // ===========================================================================
    // 回合阶段分发（IBattleRound）
    // 由 BattleRoom.RoundBegin / RoundFightBegin / RoundFightEnd / RoundEnd 逐层调用，
    // 再逐层下发给本方每个 BattleUnit，形成「大阶段 Room → Player → Unit」的结算时机。
    // ===========================================================================

    /**
     * 回合开始：法力回复 + 抽牌 + 本方各单位 RoundBegin（在场单位解锁攻击）。
     * @returns 本回合抽到的手牌 UID（供房间组装 dealCached）
     */
    RoundBegin(): number[] {
        /** 每回合开始时，Mana + MANA_ROUND_ADD，已达 MANA_MAX_LIMIT 则不再增加 */
        this.hero.curMana = Math.min(BattleConst.MANA_MAX_LIMIT, this.hero.curMana + BattleConst.MANA_ROUND_ADD);
        this.hero.maxMana = Math.min(BattleConst.MANA_MAX_LIMIT, this.hero.maxMana + BattleConst.MANA_ROUND_ADD);

        /** 抽牌阶段 */
        let drawn = this.DrawCard(BattleConst.DRAW_PER_ROUND);

        /** 遍历本方单位，逐个触发 RoundBegin */
        Object.values(this.Units).forEach((unit) => unit.RoundBegin());

        return drawn;
    }

    /** 回合进入战斗：遍历本方单位触发 RoundFightBegin */
    RoundFightBegin(): void {
        Object.values(this.Units).forEach((unit) => unit.RoundFightBegin());
    }

    /** 回合战斗结束：遍历本方单位触发 RoundFightEnd */
    RoundFightEnd(): void {
        Object.values(this.Units).forEach((unit) => unit.RoundFightEnd());
    }

    /** 回合结束：遍历本方单位触发 RoundEnd */
    RoundEnd(): void {
        Object.values(this.Units).forEach((unit) => unit.RoundEnd());
    }

    /**
     * 一张非法术卡牌在地块上成功召唤出单位后创建的 BattleUnit。
     * @param cardUid 单卡 UID
     * @param field 所在地块索引
     */
    CreateUnit(cardUid: number, field: number): void {
        let card = this.AllCards[cardUid];
        if (!card) {
            Logger.LogWarn(`BattlePlayer[${this.uid}] CreateUnit 未找到卡 uid=${cardUid}`);
            return;
        }
        let unit = new BattleUnit(card);
        /** 与 card 无关的战斗属性托管在这里 */
        unit.uid = cardUid;
        unit.side = this.side;
        unit.field = field;
        unit.Spawn();
        this.Units[cardUid] = unit;
        Logger.LogInfo(`BattlePlayer[${this.uid}] 召唤单位 uid=${cardUid} cid=${unit.cid} field=${field} AttackCount=${unit.AttackCount}`);
    }

    /**
     * 检索本方一块「空闲」地块（从 index 5 → 0 从后往前找第一块）。
     *
     * 空闲判定＝ `!BattleFields[i].hasCard`（即该格无卡牌占位）：
     *   - 从未部署 / 已结算（法术消耗或单位阵亡后清格）→ 空闲；
     *   - 已部署但未翻开（含 PUT 法术）→ `hasCard=true`，被视为占用，不可召唤。
     * 无空地返回 -1。
     */
    FindEmptyField(): number {
        for (let i = BattleConst.FIELD_SIZE - 1; i >= 0; i--) {
            if (!this.BattleFields[i].hasCard) {
                return i;
            }
        }
        return -1;
    }

    /**
     * 凭空召唤：在本方第一块空地上召唤单位（占格 + CreateUnit + Spawn）。
     * @param cardUid 要被召唤的卡 UID（须在 AllCards 中，且应为单位牌而非法术）
     * @returns 落地地块 index；无空地或卡非法时返回 -1
     */
    SummonUnit(cardUid: number): number {
        let target = this.FindEmptyField();
        if (target < 0) {
            Logger.LogWarn(`BattlePlayer[${this.uid}] SummonUnit 无空地，取消召唤 uid=${cardUid}`);
            return -1;
        }
        let card = this.AllCards[cardUid];
        if (!card) {
            Logger.LogWarn(`BattlePlayer[${this.uid}] SummonUnit 未找到卡 uid=${cardUid}`);
            return -1;
        }
        /** 占格（MakeBornAction 依赖 GetFieldCard 读到该格卡牌快照） */
        this.BattleFields[target].cardUid = cardUid;
        this.CreateUnit(cardUid, target);
        return target;
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
                    skillId: [...cardRaw.skillId],
                    passiveSkillId: [...cardRaw.passiveSkillId],
                    skillExpander: [],
                    atk: cardRaw.atk,
                    /**
                     * 防御值其实就是HP，应该是cur>max UI会显示绿色，cur<max UI会显示红色
                     */
                    curDef: cardRaw.def,
                    maxDef: cardRaw.def,
                    isPrepare: false,
                    flyLayer: cardRaw.FlyLayer,
                    auraSkillId: [...cardRaw.auraSkillId],
                },
            }
            let NewCard = new BattleCard(cid, raw);
            NewCard.IsMagic = cardRaw.IsMagic == 1;
            this.AllCards[cardUid] = NewCard;
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
            cemeteryCount: this.CemeteryUIDs.length,
        }
        return {
            heroInfo: heroInfo,
            hand: this.HandUIDs.map((uid) => this.AllCards[uid].Current),
            battleFields: Object.values(this.BattleFields).map((field, index) => {

                let fieldSimple: BattleFieldSimple = {
                    index: Number(index),
                    ...field.GetSimple(),
                }

                if (fieldSimple.hasCard) {
                    fieldSimple.card = this.AllCards[field.cardUid].Current;
                }

                return fieldSimple;
            }),
            deckIDs: this.DeckUIDs.map((uid) => this.AllCards[uid].cid),
            /**
             * 服务端墓地内部记录 UID（保证单卡唯一）；发给客户端前通过 UID 反查 CID，
             * 因为客户端按「卡牌型 ID」识别墓地/回收，而不认运行时的实例 UID。
             */
            cemeteryIDs: this.CemeteryUIDs.map((uid) => this.AllCards[uid]?.cid ?? 0),
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
        let cardUids = req.cardUids || [];
        cardUids.forEach((uid) => {
            let uidIndex = this.HandUIDs.findIndex((u) => u === uid);
            if (uidIndex >= 0) {
                this.HandUIDs.splice(uidIndex, 1);
                this.DeckUIDs.push(uid);
            }
        });
        let cards = this.DrawCard(cardUids.length);
        this.ShuffleDeck();
        return {
            changedCards: cards.map((uid) => this.AllCards[uid].Current),
            quickBattle: req.quickBattle,
            actions: [],
            selectedCards: cardUids,
            logs: [this.MakeLog(BattleLogType.PlayGame, BattleLogSide.NullSide)],
        }
    }

    /**
     * 应用布阵动作（25006 携带的 DeployActionSimple[]）。
     * 更新服务端记录的战场情况
     * @param actions 客户端提交的布阵动作
     */
    ApplyDeploy(actions: DeployActionSimple[]): void {
        /**
         * 两遍处理，避免客户端动作顺序影响推挤结果：
         *   第一遍：PUSH（把已在场的卡从 field.index 挪到 index 落点）；
         *   第二遍：PUT（放置本回合打出的新牌 / 消耗法术）。
         * 「先推挤、再落子」保证 PUSH 拿到的永远是部署前的旧占位卡，
         * 不会把刚放下的新牌误推走（问题2：第二轮部署+PUSH）。
         */

        let pushActions = actions.filter((action) => action.type === ActionType.PUSH) || [];
        let putActions = actions.filter((action) => action.type === ActionType.PUT) || [];

        let otherActions = actions.filter((action) => action.type !== ActionType.PUSH && action.type !== ActionType.PUT) || [];

        otherActions.forEach((action) => {
            Logger.LogError(`BattlePlayer[${this.uid}] 未知动作=${action.type}`, action);
        });

        this.ApplyPushActions(pushActions);
        this.ApplyPutActions(putActions);
    }

    /** 第一遍：处理所有 PUSH 推挤（旧占位卡从 field.index → index）。 */
    private ApplyPushActions(actions: DeployActionSimple[]): void {
        actions.forEach((action) => {
            let targetIndex = action.index;
            let origSlotID = action.field?.index ?? -1;
            let origSlot = this.BattleFields[origSlotID];
            if (!origSlot) {
                Logger.LogError(`BattlePlayer[${this.uid}] PUSH=${targetIndex} 未找到原地块`);
                return;
            }
            let movingUid = origSlot.cardUid;
            if (movingUid <= 0) {
                Logger.LogWarn(`BattlePlayer[${this.uid}] PUSH=${targetIndex} 原地块无卡可推`);
                return;
            }
            let targetSlot = this.BattleFields[targetIndex];
            if (!targetSlot || targetSlot.hasCard) {
                Logger.LogWarn(`BattlePlayer[${this.uid}] PUSH=${targetIndex} 落点已占用，忽略`);
                return;
            }
            origSlot.cardUid = 0;
            targetSlot.cardUid = movingUid;
            /** 随卡移动的单位同步更新所在地块 */
            let unit = this.Units[movingUid];
            if (unit) {
                unit.field = targetIndex;
            }
            Logger.LogInfo(`BattlePlayer[${this.uid}] PUSH ${origSlotID}→${targetIndex} uid=${movingUid}`);
        });
    }

    /** 第二遍：处理所有 PUT 落子（法术牌与单位牌都先扣着占格，翻牌在结算阶段进行）。 */
    private ApplyPutActions(actions: DeployActionSimple[]): void {
        actions.forEach((action) => {
            let bid = action.index;
            let cardUid = action.cardUid;
            let slot = this.BattleFields[bid];
            if (!slot) {
                Logger.LogWarn(`BattlePlayer[${this.uid}] PUT=${bid} 地块不存在`);
                return;
            }
            if (!cardUid || !this.AllCards[cardUid]) {
                Logger.LogWarn(`BattlePlayer[${this.uid}] PUT=${bid} cardUid=${cardUid} 非法`);
                return;
            }
            if (slot.hasCard) {
                // 目标地块已占用（部署阶段应无此情形，健壮性兜底，避免重叠）
                Logger.LogWarn(`BattlePlayer[${this.uid}] PUT=${bid} 已占用`);
                return;
            }

            slot.cardUid = cardUid;

            /**
             * 从手牌中移除这张牌。
             *
             * 部署阶段不做牌型区分：法术牌与单位牌都以「扣着的牌（PUT Card）」占格，
             * 真实效果留到行动阶段逐格翻牌时决定 ——
             *   法术 → 翻开即消耗进墓；  单位 → 翻开召唤（CreateUnit + Spawn）。
             */
            let handIndex = this.HandUIDs.indexOf(cardUid);
            if (handIndex >= 0) {
                this.HandUIDs.splice(handIndex, 1);
            }
        });
    }

    /**
     * 法术牌被「翻开」后立即消耗：塞进墓地并清空所占格位，同时生成进墓表现。
     *
     * ⚠ 调用时机必须是行动阶段的翻牌流程（BattleRoom.ResolveFlip）。
     * 部署阶段已把法术牌作为扣牌占格并从手牌移除，因此这里不再触碰手牌，
     * 只负责：进墓地（记录 UID）→ 清格（slot.cardUid=0）→ 产出表现日志。
     *
     * @param cardUid 法术单卡 UID
     * @param field   法术牌目前所占的地块索引（用于清格）
     * @returns 供当格战斗表现追加的进墓日志
     */
    DiscardToCemetery(cardUid: number, field: number): BattleLogSimple[] {
        let logs: BattleLogSimple[] = [];

        if (!this.CemeteryUIDs.includes(cardUid)) {
            this.CemeteryUIDs.push(cardUid);
        }

        /** 法术翻开即离场，清掉占用的格位 */
        let slot = this.BattleFields[field];
        if (slot && slot.cardUid === cardUid) {
            slot.cardUid = 0;
        }

        const cid = this.AllCards[cardUid]?.cid ?? 0;
        let unit = [this.MakeLogUnit(this.side, field, cid, 0, 0, 0)];
        logs.push(this.MakeLog(BattleLogType.DisplayAddToCemetery, BattleLogSide.NullSide, unit, [cardUid]));
        Logger.LogInfo(`BattlePlayer[${this.uid}] 法术翻开消耗 uid=${cardUid} cid=${cid} → 墓地`);
        return logs;
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

    /** 读取某格单位的攻击力（优先 BattleUnit，退化为卡牌快照）。 */
    GetFieldAtk(index: number): number {
        return this.GetUnit(index)?.atk ?? this.GetFieldCard(index)?.abilitie?.atk ?? 0;
    }

    /** 读取某格单位的飞行层数（>0 视为飞行单位）。 */
    GetFlyLayer(index: number): number {
        return this.GetFieldCard(index)?.abilitie?.flyLayer ?? 0;
    }

    /** 读取自己某个地块上的单位（未召唤/已阵亡时返回 undefined）。 */
    GetUnit(index: number): BattleUnit | undefined {
        let uid = this.GetFieldCardUid(index);
        if (uid <= 0) {
            return undefined;
        }
        return this.Units[uid];
    }

    /**
     * 自己某个地块上「可主动攻击」的单位：场上存活（def>0）且本回合可攻击（CanAttack）。
     * 新召唤单位本回合默认不可攻击（除非持冲锋），在场单位经 RoundBegin 解锁。
     */
    GetCanAttackUnit(index: number): BattleUnit | undefined {
        let unit = this.GetUnit(index);
        if (!unit || unit.def <= 0 || unit.AttackCount <= 0) {
            return undefined;
        }
        return unit;
    }

    /** 用单位对某格造成伤害：交给 BattleUnit.Damage（归零即死亡），并回写卡牌快照。 */
    ApplyUnitDamage(unit: BattleUnit, dmg: number): number {
        /** 伤害 ≤ 0 不触发受击/死亡（0 伤不该有受伤表现） */
        if (dmg <= 0) {
            return unit.def;
        }
        let next = unit.Damage(dmg);
        this.SyncUnitToCard(unit);
        return next;
    }

    /** 把单位的实时攻防回写到 AllCards 快照，保证 GetBattler / 客户端快照一致。 */
    SyncUnitToCard(unit: BattleUnit): void {
        let card = this.AllCards[unit.uid];
        if (!card || !card.Current || !card.Current.abilitie) {
            return;
        }
        card.Current.abilitie.atk = unit.atk;
        card.Current.abilitie.curDef = unit.def;
        card.Current.abilitie.maxDef = unit.maxDef;
    }

    /** 单位阵亡处理：进入墓地（记录 UID）→ 清空所在格位 → 移除单位。 */
    OnUnitDead(unit: BattleUnit): void {
        if (!this.CemeteryUIDs.includes(unit.uid)) {
            this.CemeteryUIDs.push(unit.uid);
        }
        let slot = this.BattleFields[unit.field];
        if (slot) {
            slot.cardUid = 0;
        }
        /** 同步回卡牌快照（curDef=0），保证已死亡单位的快照不再显示在场 */
        let card = this.AllCards[unit.uid];
        if (card?.Current?.abilitie) {
            card.Current.abilitie.curDef = 0;
        }
        delete this.Units[unit.uid];
        Logger.LogInfo(`BattlePlayer[${this.uid}] 单位阵亡 → 墓地 uid=${unit.uid} cid=${unit.cid}`);
    }

    /** 生成自己某个地块单位的战斗日志单元（直接用 BattleUnit.GetLogUnit）；无单位返回 undefined。 */
    GetFieldUnitLog(index: number): BattleLogUnit | undefined {
        let unit = this.GetUnit(index);
        if (unit) {
            return unit.GetLogUnit();
        }
        return undefined;
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
     * 的 uid/cid/费用/物质化与登场状态（默认 locationStatus=HAND_TO_FIELD(13)），
     * hits[0].abilitie 携带身上已生效的攻防与异能，供客户端重建该格卡牌的表现。
     *
     * 反编译客户端（BattleMainBorn）确认：Born 由 hit 直接产单位，**没有**「目标格须
     * 预先有卡牌快照」的前置校验；但 hit.card.locationStatus 必须让客户端把它标记为
     * 「已在场上」（ENTER_FIELD=7 / DECK_TO_FIELD=10），否则被视为未登场而丢弃。
     * 部署翻牌沿用默认 HAND_TO_FIELD(13)（该格已被快照接纳，不冲突）；
     * 凭空召唤场景请显式传 DECK_TO_FIELD(10)（目标不过任何快照）。
     *
     * @param index 自己某块地块的索引
     * @param locStatus 登场状态，默认 HAND_TO_FIELD
     */
    MakeBornAction(index: number, locStatus: LocationStatus = LocationStatus.HAND_TO_FIELD): Action | undefined {
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
                locationStatus: locStatus,
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
