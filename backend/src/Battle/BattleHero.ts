import { HeroInfo } from "mc-local-share";

/**
 * 主将
 */
export class BattleHero
{
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

    
}