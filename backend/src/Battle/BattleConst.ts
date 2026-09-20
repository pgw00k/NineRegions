/**
 * 战斗常量。
 *
 * 数值来源：JYLog_Backup 客户端日志中记录的正常对局表现（起手张数、每轮抽牌数等），
 * 属于服务端权威配置，集中放置便于后续按卡牌规则细化时调整。
 */
export class BattleConst {
    /** 起手手牌数（InitBattleInfo 中抽） */
    static readonly INIT_HAND = 5;

    /** 每回合开始抽牌数（DealStep / DeploymentStart 阶段） */
    static readonly DRAW_PER_ROUND = 1;

    /** 战场格数 */
    static readonly FIELD_SIZE = 6;

    /** 主将初始 HP */
    static readonly INIT_HP = 10;

    /** 主将初始法力 */
    static readonly INIT_MANA = 5;

    /** 每回合法力增加 */
    static readonly MANA_ROUND_ADD = 1;
    
    /** 最大法力 */
    static readonly MANA_MAX_LIMIT = 10;

    /** 【测试】凭空召唤时本体的 SpecialSummon 技能ID。
     *  客户端 BattleMainSkillCast 依 hit.abilitie.skillId 装填技能效果，
     *  空数组不触发 processSpecialSummon；固定给一个召唤技能以走通建实体链。 */
    static readonly TEST_SUMMON_SKILL_ID = 100006;

    /** 客户端 BattleDataManager 认可的主将索引（IsHeroIndex(index)==configHeroIndex 实测=100）。
     *  Skill 动作的 b1/attacker 若用 -1，客户端 IsHeroIndex(-1)=false，判施法方非法直接掐掉召唤。 */
    static readonly HERO_INDEX = 100;
}
