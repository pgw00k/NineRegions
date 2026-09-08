import { DataSource, Repository } from "typeorm";
import { HeroLibrary } from "../data/HeroLibrary";

/**
 * 英雄库服务类 - 处理玩家英雄数据的CRUD操作和相关业务逻辑
 */
export class HeroLibraryService {
    private heroRepository: Repository<HeroLibrary>;
    
    constructor(dataSource: DataSource) {
        this.heroRepository = dataSource.getRepository(HeroLibrary);
    }

    /**
     * 根据玩家ID获取该玩家的所有英雄
     * @param playerId 玩家ID
     * @returns 英雄对象数组
     */
    async getPlayerHeroes(playerId: number): Promise<HeroLibrary[]> {
        return await this.heroRepository.find({
            where: { pid: playerId }
        });
    }

    /**
     * 根据英雄ID获取英雄信息
     * @param heroId 英雄ID
     * @returns 英雄对象或null
     */
    async getHeroById(heroId: number): Promise<HeroLibrary | null> {
        return await this.heroRepository.findOne({
            where: { id: heroId }
        });
    }

    /**
     * 创建新英雄记录
     * @param hero 英雄对象（不包含ID）
     * @returns 创建的英雄对象
     */
    async createHero(hero: Partial<HeroLibrary>): Promise<HeroLibrary> {
        const newHero = this.heroRepository.create(hero);
        return await this.heroRepository.save(newHero);
    }

    /**
     * 更新英雄信息
     * @param heroId 英雄ID
     * @param heroUpdate 更新的英雄数据
     * @returns 更新后的英雄对象
     */
    async updateHero(heroId: number, heroUpdate: Partial<HeroLibrary>): Promise<HeroLibrary | null> {
        const hero = await this.getHeroById(heroId);
        if (!hero) {
            return null;
        }
        
        Object.assign(hero, heroUpdate);
        return await this.heroRepository.save(hero);
    }

    /**
     * 解锁英雄
     * @param playerId 玩家ID
     * @param heroId 英雄ID
     * @returns 是否解锁成功
     */
    async unlockHero(playerId: number, heroId: number): Promise<boolean> {
        const hero = await this.heroRepository.findOne({
            where: { id: heroId, pid: playerId }
        });
        
        if (hero) {
            hero.unlockState = 1;
            await this.heroRepository.save(hero);
            return true;
        }
        
        return false;
    }
}