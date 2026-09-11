import { In } from 'typeorm';
import { Card } from '../data/Card';
import { BaseRepositoryTemplate } from './BaseRepositoryTemplate';

export class CardService extends BaseRepositoryTemplate<Card> {
    static Instance: CardService;

    constructor() {
        super(Card);
        this._Template = this._Repository.create();
        CardService.Instance = this;
    }

    async GetCard(cid: number): Promise<Card | null> {
        return await this._Repository.findOne({
            where: {
                cid,
            },
        });
    }

    async GetCards(cids: number[]): Promise<Card[]> {
        return await this._Repository.find({
            where: {
                cid: In(cids),
            },
        });
    }

    async AddCard(card: Partial<Card>): Promise<void> {
        let id = card.cid;
        if (!id) {
        } else {
            this._Repository.upsert(card, {
                conflictPaths: ['cid'],
                skipUpdateIfNoValuesChanged: true,
            });
        }
    }

    /**
     * 批量添加卡牌数据
     */
    async AddCards(cards: Partial<Card>[]): Promise<void> {
        let vailds = cards.filter((item) => item.cid);
        if (vailds.length === 0) {
            return;
        }
        this._Repository.upsert(vailds, {
            conflictPaths: ['cid'],
            skipUpdateIfNoValuesChanged: true,
        });
    }
}