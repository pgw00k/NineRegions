import { BattleFieldSimple } from "mc-local-share";

/**
 * 战场地块
 */
export class BattleField {

    /** 当前地块上的牌UID */
    cardUid: number = 0;

    GetSimple(): BattleFieldSimple {
        return {
            hasCard: this.hasCard,
        }
    }

    get hasCard(): boolean {
        return this.cardUid > 0;
    }
}