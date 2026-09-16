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
}
