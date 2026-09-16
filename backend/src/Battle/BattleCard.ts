import { CardSimple_2 } from "mc-local-share";

/**
 * 战斗场景中使用的卡牌
 */
export class BattleCard {
    /** 牌型ID */
    public cid: number = 0;

    /** 原始数据 */
    public Raw: CardSimple_2 = {};

    /** 当前数据 */
    public Current: CardSimple_2 = {};

    public constructor(cid: number, raw: CardSimple_2) {
        this.cid = cid;
        this.Raw = {
            ...raw,
        };
        this.Current = {
            ...raw,
        };
    }
}