namespace Table
{
    // Namespace: Table
    public class CardsDefine // TypeDefIndex: 8723
    {
        // Properties
        public int ID;
        public string Version;
        public int IsFormal;
        public int IsFree;
        public bool IsMagic;
        public string Name;
        public string Desc;
        public int Cost;
        public int Atk;
        public int Def;
        public int Rarity;
        public int Meta;
        public int Element;
        public int Race1;
        public int Race2;
        public List<int> SkillList;
        public List<int> PassiveSkilllist;
        public List<int> AruaList;
        public bool IsHuge;
        public int FlyLayer;
        public int GroupId;
        public int UseCondition;
        public int FobCondition;
        public int Priority;
        public AIClass AIClass;
        public int AITarget;
        public string Story;
        public string Score;
        public int CompoundItem1;
        public int CompoundItem1Number;
        public int CompoundItem2;
        public int CompoundItem2Number;
        public int ResolveGetItem1;
        public int ResolveGetItem1Number;
        public int ResolveGetItem2;
        public int ResolveGetItem2Number;
        public string ChessEffect;
        public string Painter;
        public int AttackPlusTime;
        public int SummonPlusTime;
        public int DeadPlusTime;
        public CardSpeed CardSpeed;
        public int CardType1;
        public int CardType2;
        public int InfiCardID;
        public int CardLevel;
        public int NextLevel;
        public int Price;
        public List<int> Keywords;
        public int Addweight;
        public int UnitTableIndex;
        public int BattleShowIndex;
        public int ResolveOrNot;
        public int ExtraPriority;
        public List<CardTag> SkillTags;
        public AIDamageType AIDamageType;
        public int AIDamage;
        public string ItemIcon;
        public int CameraSet;
        public List<int> ConditionLight;
        public string CVName;
        public int IsToken;
        public int TokenCard;
    }

    public class ShopItemCostDefine // TypeDefIndex: 8809
    {
        // Properties
        public int ID;
        public int ShopID;
        public string StartTime;
        public string EndTime;
        public string TagName;
        public ShopItemType ShopItemType;
        public int ItemID;
        public int SaleCount;
        public int CurrencyID;
        public int CostNum;
        public string DisplayDiscount;
        public int DiscountCost;
        public string DiscountStartTime;
        public string DiscountEndTime;
        public int BuyLimitNum;
        public ShopLimitRefresh ShopLimitRefresh;
        public bool IsShow;
        public int ItemViewPriority;
        public SaleType SaleType;
        public int PayId;
    }

    public class ItemDefine // TypeDefIndex: 8810
    {
        // Properties
        public int ID;
        public string Name;
        public string BattleFieldRes;
        public ItemType ItemType;
        public int Element;
        public string ItemIcon;
        public int MaxNum;
        public bool isCall;
        public int Rarity;
        public bool IsSignDes;
        public string ItemSignDes;
    }

    public enum ItemType
    {
        Item = 0,
        UseItem = 1,
        Equip = 2,
        Card = 3,
        Exp = 4,
        Gold = 5,
        ALL = 6,
        Diamond = 7,
        Jade = 8,
        Silver = 9,
        InfiItem = 10,
        FavorItem = 11,
        RPGEquip = 13,
        Ash = 14,
        Recipe = 15,
        CardDeck = 16,
        Portrait = 17,
        PortraitFrame = 18,
        Expression = 19,
        ExpressionBag = 20,
        Appellation = 21,
        AppellationFrame = 22,
        BpEXP = 23,
        HeroSkin = 24,
        ItemGiftBag = 25,
        ForgeItem = 26,
    }

    // Namespace: Table
    public class BuffersDefine // TypeDefIndex: 8728
    {
        // Properties
        public int ID;
        public string Desc;
        public int Priority;
        public ActiveEffect ActiveEffect;
        public int Parm1;
        public int Parm2;
        public int Parm3;
        public List<int> ParmList;
        public int UIInteraction;
        public List<string> MyUIInteractionBuilder;
        public List<string> OpponentUIInteractionBuilder;
        public bool CanChangeTarget;
    }

    public enum ActiveEffect // TypeDefIndex: 8610
    {
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
}