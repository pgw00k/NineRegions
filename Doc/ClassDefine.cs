namespace Table
{
    // Namespace: Table
    public class CardsDefine // TypeDefIndex: 8723
    {
        // Properties
        public int ID { get; }
        public string Version { get; }
        public int IsFormal { get; }
        public int IsFree { get; }
        public bool IsMagic { get; }
        public string Name { get; }
        public string Desc { get; }
        public int Cost { get; }
        public int Atk { get; }
        public int Def { get; }
        public int Rarity { get; }
        public int Meta { get; }
        public int Element { get; }
        public int Race1 { get; }
        public int Race2 { get; }
        public List<int> SkillList { get; }
        public List<int> PassiveSkilllist { get; }
        public List<int> AruaList { get; }
        public bool IsHuge { get; }
        public int FlyLayer { get; }
        public int GroupId { get; }
        public int UseCondition { get; }
        public int FobCondition { get; }
        public int Priority { get; }
        public AIClass AIClass { get; }
        public int AITarget { get; }
        public string Story { get; }
        public string Score { get; }
        public int CompoundItem1 { get; }
        public int CompoundItem1Number { get; }
        public int CompoundItem2 { get; }
        public int CompoundItem2Number { get; }
        public int ResolveGetItem1 { get; }
        public int ResolveGetItem1Number { get; }
        public int ResolveGetItem2 { get; }
        public int ResolveGetItem2Number { get; }
        public string ChessEffect { get; }
        public string Painter { get; }
        public int AttackPlusTime { get; }
        public int SummonPlusTime { get; }
        public int DeadPlusTime { get; }
        public CardSpeed CardSpeed { get; }
        public int CardType1 { get; }
        public int CardType2 { get; }
        public int InfiCardID { get; }
        public int CardLevel { get; }
        public int NextLevel { get; }
        public int Price { get; }
        public List<int> Keywords { get; }
        public int Addweight { get; }
        public int UnitTableIndex { get; }
        public int BattleShowIndex { get; }
        public int ResolveOrNot { get; }
        public int ExtraPriority { get; }
        public List<CardTag> SkillTags { get; }
        public AIDamageType AIDamageType { get; }
        public int AIDamage { get; }
        public string ItemIcon { get; }
        public int CameraSet { get; }
        public List<int> ConditionLight { get; }
        public string CVName { get; }
        public int IsToken { get; }
        public int TokenCard { get; }
    }

    public class ShopItemCostDefine // TypeDefIndex: 8809
    {
        // Properties
        public int ID { get; }
        public int ShopID { get; }
        public string StartTime { get; }
        public string EndTime { get; }
        public string TagName { get; }
        public ShopItemType ShopItemType { get; }
        public int ItemID { get; }
        public int SaleCount { get; }
        public int CurrencyID { get; }
        public int CostNum { get; }
        public string DisplayDiscount { get; }
        public int DiscountCost { get; }
        public string DiscountStartTime { get; }
        public string DiscountEndTime { get; }
        public int BuyLimitNum { get; }
        public ShopLimitRefresh ShopLimitRefresh { get; }
        public bool IsShow { get; }
        public int ItemViewPriority { get; }
        public SaleType SaleType { get; }
        public int PayId { get; }
    }

    public class ItemDefine // TypeDefIndex: 8810
    {
        // Properties
        public int ID { get; }
        public string Name { get; }
        public string BattleFieldRes { get; }
        public ItemType ItemType { get; }
        public int Element { get; }
        public string ItemIcon { get; }
        public int MaxNum { get; }
        public bool isCall { get; }
        public int Rarity { get; }
        public bool IsSignDes { get; }
        public string ItemSignDes { get; }
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
}