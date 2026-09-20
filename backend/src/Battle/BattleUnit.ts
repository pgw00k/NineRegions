import { BattleLogUnit } from "mc-local-share";
import { BattleCard } from "./BattleCard";
import { IBattleUnit } from "./IBattleState";

/**
 * 实际站场的单位
 */
export class BattleUnit implements IBattleUnit {
    /**
     * 单位ID
     * 和卡牌共享一个ID
     */
    public uid: number;

    /**
     * 归属
     */
    public side: number;
    /**
     * 所在地块
     */
    public field: number;
    /**
     * 牌型ID
     */
    public cid: number;
    public atk: number;
    public def: number;
    public maxDef: number;
    public isMaterialized: boolean;
    public activeSkills: number[];
    public passiveSkills: number[];

    /**
     * 可进攻次数
     * 
     */
    public AttackCount: number = 0;

    /**
     * 通过卡牌来创建单位
     * @param card 卡牌实例
     */
    constructor(card: BattleCard) {
        // uid 与卡牌共享（runtime 单卡UID）
        this.uid = card.Current.uid ?? 0;
        this.cid = card.cid;
        this.atk = card.Current.abilitie?.atk || 0;
        this.def = card.Current.abilitie?.curDef || 0;
        this.maxDef = card.Current.abilitie?.maxDef || 0;
        this.isMaterialized = card.Current.isMaterialized ?? false;
        this.activeSkills = [...(card.Current.abilitie?.skillId ?? [])];
        this.passiveSkills = [...(card.Current.abilitie?.passiveSkillId ?? [])];
    }
    GetLogUnit(): BattleLogUnit {
        return {
            side: this.side,
            field: this.field,
            cid: this.cid,
            atk: this.atk,
            def: this.def,
            maxDef: this.maxDef,
            isMaterialized: this.isMaterialized,
            activeSkills: [...this.activeSkills],
            passiveSkills: [...this.passiveSkills],
        };
    }


    Spawn() {
        /**
         * 单位召唤
         */

        /**
         * 处理被动技能
         * 例如 1000001 是冲锋，那么可以直接处理
         * 其实应该另外构建一个类，配表或者别的形式去处理更好，这里先用Switch处理
         */
        this.passiveSkills.forEach(skill => {
            switch (skill) {
                case 1000001:
                    // 冲锋
                    this.AttackCount = 1;
                    break;
            }
        });
    }
    FightBegin() {

    }

    Damage(damage: number) {
        /** 防御（HP）归零即死亡，下限 0 保证不会出现负数残防 */
        this.def = Math.max(0, this.def - damage);
        if (this.def <= 0) {
            this.Dead();
        }
        return this.def;
    }
    FightEnd() {
    }
    Dead() {
    }
    RoundBegin() {
        /** 默认情况下，单位召唤的那个回合是不会攻击的，CanAttack = false
         * 但是如果该单位已经站场了，在新回合的战斗开始时，赋予其可以主动攻击的能力，CanAttack = true
        */
        if (this.AttackCount == 0) {
            this.AttackCount ++;
        }
    }
    RoundFightBegin() {
    }
    RoundFightEnd() {
    }
    RoundEnd() {
    }
}