import { DataSource, Repository } from "typeorm";
import { Deck } from "../data/Deck";
import { BaseRepositoryTemplate } from "./BaseRepositoryTemplate";

/**
 * 套牌服务类 - 处理玩家套牌数据的CRUD操作和相关业务逻辑
 */
export class DeckService extends BaseRepositoryTemplate<Deck> {

    static Instance: DeckService;

    constructor() {
        super(Deck);
        this._Template = this._Repository.create();
        DeckService.Instance = this;
    }

    /**
     * 根据玩家ID获取该玩家的所有套牌
     * @param playerId 玩家ID
     * @returns 套牌对象数组
     */
    async getPlayerDecks(uid: string): Promise<Deck[]> {
        return await this._Repository.find({
            where: { uid }
        });
    }

    /**
     * 根据套牌ID获取套牌信息
     * @param deckId 套牌ID
     * @returns 套牌对象或null
     */
    async GetById(did: number): Promise<Deck | null> {
        return await this._Repository.findOne({
            where: { did }
        });
    }

    /**
     * 创建新套牌
     * @param deck 套牌对象（不包含ID）
     * @returns 创建的套牌对象
     */
    async createDeck(deck: Partial<Deck>): Promise<Deck> {
        const newDeck = this._Repository.create(deck);
        return await this._Repository.save(newDeck);
    }

    /**
     * 更新套牌信息
     * @param deckId 套牌ID
     * @param deckUpdate 更新的套牌数据
     * @returns 更新后的套牌对象
     */
    async updateDeck(ndid: number, deckUpdate: Partial<Deck>): Promise<Deck | null> {
        let {did, ...base} = deckUpdate;
        const deck = await this.GetById(ndid);
        if (!deck) {
            return null;
        }
        Object.assign(deck, base);
        return await this._Repository.save(deck);
    }

    /**
     * 删除套牌
     * @param deckId 套牌ID
     * @returns 是否删除成功
     */
    async deleteDeck(did: number): Promise<boolean> {
        const result = await this._Repository.delete({ did });
        return result.affected !== 0;
    }

    /**
     * 更新多个套牌信息
     * 默认必定存在，不走校验流程
     * 现阶段主要用来更新卡背
     * @param dids 套牌ID数组
     * @param decks 更新的套牌数据数组
     * @returns 是否更新成功
     */
    async UpdateDecks(dids: number[], decks: Partial<Deck>): Promise<boolean> {
        const result = await this._Repository.update(dids, decks);
        return result.affected !== 0;
    }
}