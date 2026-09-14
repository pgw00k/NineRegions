import { HeroInfo } from "mc-local-share";

/**
 * 主将
 */
export class BattleHero
{
    side: number = 0;
    heroID: number = 1;
    heroSkillID: number = 100001;
    heroSkillCD: number = 1;
    curMana: number = 5;
    maxMana: number = 5;
    curHP: number = 10;
    maxHP: number = 10;
    atk: number = 1;
    handCount: number = 0;
    deckCount: number = 40;
    cemeteryCount: number = 0;
    tmpMana: number = 0;

    constructor(preset: HeroInfo) {
        Object.assign(this, preset);
    }

    GetInfo(){
        return {
            side: this.side,
            heroID: this.heroID,
            heroSkillID: this.heroSkillID,
            heroSkillCD: this.heroSkillCD,
            curMana: this.curMana,
            maxMana: this.maxMana,
            curHP: this.curHP,
            maxHP: this.maxHP,
            atk: this.atk,
            handCount: this.handCount,
            deckCount: this.deckCount,
            cemeteryCount: this.cemeteryCount,
            tmpMana: this.tmpMana,
        }
    }


}