export interface IBattleBase {

    /** 战斗开始 */
    BattleStart():any;
    /** 战斗结束 */
    BattleEnd():any;
}

/** 每个回合触发的函数 */
export interface IBattleRound {
    /** 回合开始 */
    RoundBegin():any;

    /** 回合战斗 */
    RoundFightBegin():any;

    /** 回合战斗结束 */
    RoundFightEnd():any;

    /** 回合结束 */
    RoundEnd():any;
}

/** 每个单位触发的函数 */
export interface IBattleUnit extends IBattleRound {
    /** 被召唤出来时 */
    Spawn():any;

    /** 战斗开始时 */
    FightBegin():any;

    /** 战斗结束时 */
    FightEnd():any;

    /** 死亡时 */
    Dead():any;

    Damage(damage: number):any;
}