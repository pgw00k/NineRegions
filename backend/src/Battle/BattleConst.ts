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

    /** 客户端 BattleDataManager 认可的主将索引（IsHeroIndex(index)==configHeroIndex 实测=100）。
     *  Skill 动作的 b1/attacker 若用 -1，客户端 IsHeroIndex(-1)=false，判施法方非法直接掐掉召唤。
     *  同一条链路上空格也不行：BattleMainSkillCast 开场就 GetEntity(b1)，取不到即整条丢弃，
     *  所以凭空召唤（ResolveSummon）统一把 Skill 动作挂在主将格上 —— 主将不会离场，恒有实体。 */
    static readonly HERO_INDEX = 100;

    /**
     * 换牌 / 布阵阶段的时限（秒）。
     * 与客户端全局配置 GlobalDefines.ChangeCardTime、EmbattleTime 一致（均为 60）。
     */
    static readonly PHASE_TIME_SECONDS = 60;

    /**
     * 25002 / 25005 / 20002 的 waitingTime。
     *
     * 客户端不把它当「秒」：MCNetManager 原样传给 BattleNetMsgCacheManager.TryCacheEmbattleTimeout，
     * 再由 JYTimerMgr.TickToSec / TickToSecFloat 做 `ticks / 10000000` 得到秒数，
     * 写入 round.TimeOut = (int)(Time.realtimeSinceStartup + 剩余秒)。
     * 传 30 会被算成 3e-6 秒 ⇒ 倒计时瞬间归零，并打出
     * 「(E)SyncEmbattleTimeout Error Round : N TimeLeft : 0」；单位必须是 100ns tick。
     * 60 秒 = 6e8，仍在 32 位内，编码器无需 BigInt。
     */
    static readonly PHASE_WAITING_TIME = BattleConst.PHASE_TIME_SECONDS * 10000000;
}
