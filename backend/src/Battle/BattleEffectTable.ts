/**
 * 客户端静态配置表（Cards / Skills / Buffers）在服务端的映射。
 *
 * 服务端只做「按 id 查表 → 按 Buffers.ActiveEffect 派发」的权威结算；客户端的
 * 同名表用于校验与表现（详见 BattleActionConsumption.md §5/§6）。这里只登记
 * **数据库里没有来源**的那些行：
 *
 *   - 非正式卡：`mc.card` 只存 `Cards.IsFormal=1` 的正式卡，主将技卡（IsFormal=0）
 *     与召唤物卡都不在库中，必须内建；
 *   - Skills / Buffers：服务端没有任何持久化来源。
 *
 * 一行一条，取值与 `LUA/LuaScripts/DataTable/TableCard_*.lua` 一致；改数值一律以
 * 配置表为准（文案列会漂移，例如 Buffers[100100006].Desc 写「四个3/3」而
 * Cards[100106] 实为 3/2 —— 数值只看 Cards 行与 Parm）。
 */

/**
 * `Buffers.ActiveEffect` 枚举（TABLE_META_DEFINE.lua 的 ActiveEffect 块）。
 *
 * ⚠ 客户端派发上限是 55：`BattleMainSkillCast.ProcessAbility` 开头
 * `lea ecx,[eax-1]; cmp ecx,0x36; ja default`，因此 56 及以上（NowManaChange …
 * CancelDevour）在客户端**一律无表现**，服务端写了也播不出来。
 */
export enum ActiveEffect {
    None = 0,
    Damage = 1,
    Control = 2,
    AdditionalAttack = 3,
    Devour = 4,
    Draw = 5,
    RestoreHP = 6,
    SpecialSummon = 7,
    GiveAbilities = 8,
    Destroy = 9,
    CreateCard = 10,
    Revive = 11,
    HandChangeCost = 12,
    HandThrow = 13,
    GiveAcitveAbilities = 14,
    Move = 15,
    Change = 16,
    Talk = 17,
    MaxMana = 18,
    TempMana = 19,
    SummonHand = 20,
    BackHand = 21,
    DamageSpecial = 22,
    CopyToHand = 23,
    SummonDeck = 24,
    GetUseCards = 25,
    CancelSkill = 26,
    Silence = 27,
    ChangeCostByField = 28,
    ExplanChange = 29,
    MutiDamage = 30,
    ChageHeroAndSkill = 31,
    ChageExplanByHero = 32,
    ChangeLayer = 33,
    CreateAndSummon = 34,
    BackDeck = 35,
    GetCard = 36,
    SummonCopy = 37,
    GraToDeck = 38,
    Exile = 39,
    CleanGra = 40,
    PlayerHPChange = 41,
    LeaveBattle = 42,
    Reap = 43,
    HandChange = 44,
    HealSpecial = 45,
    DefChange = 46,
    ChangeRevive = 47,
    ChangeBuffTarget = 48,
    HugeExit = 49,
    DestroyPlayer = 50,
    SpecialSpell = 51,
    GiveHaloAbilities = 52,
    HandChangeFromDeck = 53,
    LeaveBattleTrigger = 54,
    DealSameDamage = 55,
    NowManaChange = 56,
    MoveDeckTop = 57,
    Charge = 58,
    MaxTempMana = 59,
    LostTempMana = 60,
    CreateOppHand = 61,
    LeaveSummon = 62,
    TriggerSkill = 63,
    DeckThrow = 64,
    CreateCardToOther = 65,
    HeroSkillCD = 66,
    CopyAndUseSkill = 67,
    CancelDevour = 68,
}

/** `Cards` 表一行（只登记非正式卡；正式卡随卡组从 mc.card 读取）。 */
export interface CardDef {
    cid: number;
    /** 是否法术/魔术牌：翻开即进墓并结算 SkillList，不召唤单位 */
    isMagic: boolean;
    cost: number;
    atk: number;
    def: number;
    /** `Cards.SkillList`：主动技能 id，翻牌时逐个查 Skills → Buffers 结算 */
    skillIdList: number[];
    /** `Cards.PassiveSkilllist`：被动能力 id，如 1000001=冲锋（BattleUnit.Spawn 解释） */
    passiveSkillIdList: number[];
}

/** `Skills` 表一行。 */
export interface SkillDef {
    id: number;
    /** `Skills.Buffers`：效果本体（Buffers 表主键） */
    buffers: number[];
    /** `Skills.Pointing`（PoingtingType）：Free=0 / Pointing=1 / NonPointing=2 */
    pointing: number;
    /**
     * `Skills.EffectTarget`：客户端 UI 的目标范围掩码。服务端自行求值落点，
     * 不消费这一列 —— 数值含义未在配置表里给出枚举（客户端也只透传成 int）。
     */
    effectTarget: number;
}

/** `Buffers` 表一行：效果本体，`ActiveEffect` 决定做什么，Parm* 是参数。 */
export interface BufferDef {
    id: number;
    activeEffect: ActiveEffect;
    parm1: number;
    parm2: number;
    parm3: number;
    parmList: number[];
}

export class BattleEffectTable {
    /** 非正式卡（Cards.IsFormal=0）。 */
    static readonly CARDS: Record<number, CardDef> = {
        /**
         * Cards[100006] 幻日英灵 —— 主将技 100006 的卡面（HeroeUniqueSkills[100006].CardID）。
         * 189 条 HeroeUniqueSkills 的 ID 与 CardID 全部相等，故可用 `hero.heroSkillID` 反查。
         * IsMagic=true / Cost=6 / SkillList={100100006}（不吃法力：SkillCost=0）。
         */
        100006: {
            cid: 100006,
            isMagic: true,
            cost: 6,
            atk: 0,
            def: 0,
            skillIdList: [100100006],
            passiveSkillIdList: [],
        },
        /** Cards[100106] 耀魂武士 —— 100006 的召唤物。 */
        100106: {
            cid: 100106,
            isMagic: false,
            cost: 1,
            atk: 3,
            def: 2,
            skillIdList: [],
            passiveSkillIdList: [1000001],
        },
    };

    static readonly SKILLS: Record<number, SkillDef> = {
        /** Skills[100100006] 召唤四个耀魂武士：Trigger=100 / Pointing=Free(0) / EffectTarget=2000。 */
        100100006: {
            id: 100100006,
            buffers: [100100006],
            pointing: 0,
            effectTarget: 2000,
        },
    };

    static readonly BUFFERS: Record<number, BufferDef> = {
        /**
         * Buffers[100100006]：ActiveEffect=SpecialSummon(7)、Parm2=100106（召唤物 cid）、
         * Parm3=4（数量）、ParmList={1000001}（额外赋予召唤物的能力，此处与
         * Cards[100106].PassiveSkilllist 同值）。
         */
        100100006: {
            id: 100100006,
            activeEffect: ActiveEffect.SpecialSummon,
            parm1: 0,
            parm2: 100106,
            parm3: 4,
            parmList: [1000001],
        },
    };

    static GetCard(cid: number): CardDef | undefined {
        return this.CARDS[cid];
    }

    static GetSkill(id: number): SkillDef | undefined {
        return this.SKILLS[id];
    }

    static GetBuffer(id: number): BufferDef | undefined {
        return this.BUFFERS[id];
    }
}
