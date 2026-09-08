import { DataSource, Repository } from "typeorm";
import { Deck } from "../data/Deck";

/**
 * 套牌服务类 - 处理玩家套牌数据的CRUD操作和相关业务逻辑
 */
export class DeckService {
    private deckRepository: Repository<Deck>;
    private dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
        this.deckRepository = dataSource.getRepository(Deck);
    }

    /**
     * 根据玩家ID获取该玩家的所有套牌
     * @param playerId 玩家ID
     * @returns 套牌对象数组
     */
    async getPlayerDecks(playerId: number): Promise<Deck[]> {
        return await this.deckRepository.find({
            where: { pid: playerId }
        });
    }

    /**
     * 根据套牌ID获取套牌信息
     * @param deckId 套牌ID
     * @returns 套牌对象或null
     */
    async getDeckById(deckId: number): Promise<Deck | null> {
        return await this.deckRepository.findOne({
            where: { did: deckId }
        });
    }

    /**
     * 创建新套牌
     * @param deck 套牌对象（不包含ID）
     * @returns 创建的套牌对象
     */
    async createDeck(deck: Partial<Deck>): Promise<Deck> {
        const newDeck = this.deckRepository.create(deck);
        return await this.deckRepository.save(newDeck);
    }

    /**
     * 更新套牌信息
     * @param deckId 套牌ID
     * @param deckUpdate 更新的套牌数据
     * @returns 更新后的套牌对象
     */
    async updateDeck(deckId: number, deckUpdate: Partial<Deck>): Promise<Deck | null> {
        const deck = await this.getDeckById(deckId);
        if (!deck) {
            return null;
        }
        
        Object.assign(deck, deckUpdate);
        return await this.deckRepository.save(deck);
    }

    /**
     * 删除套牌
     * @param deckId 套牌ID
     * @returns 是否删除成功
     */
    async deleteDeck(deckId: number): Promise<boolean> {
        const result = await this.deckRepository.delete({ did: deckId });
        return result.affected !== 0;
    }
}