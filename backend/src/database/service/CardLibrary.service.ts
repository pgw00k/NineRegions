import { CardLibrary } from '../data/CardLibrary';
import { AppDataSource } from '../DataSource';
import { BaseRepositoryTemplate } from './BaseRepositoryTemplate';

export class CardLibraryService extends BaseRepositoryTemplate<CardLibrary> {
    static Instance: CardLibraryService;

    public CHUNK_SIZE = 512;
    public TableName: string = '';
    public UniqueConstraint: string = '';

    constructor() {
        super(CardLibrary);
        this._Template = this._Repository.create();
        CardLibraryService.Instance = this;

        // 3. 从实体元数据中获取表名和列名，避免硬编码
        let metadata = this._Repository.metadata;
        this.TableName = metadata.tableName;
        this.UniqueConstraint = metadata.uniques[0].name;
    }

    async GetCard(uid: number, cid: number): Promise<CardLibrary | null> {
        return await this._Repository.findOne({
            where: {
                uid: uid,
                cid: cid,
            },
        });
    }

    async AddCard(uid: number, cid: number, count: number = 1): Promise<void> {
        let card = await this.GetCard(uid, cid);
        if (card) {
            card.count += count;
        } else {
            card = await this._Repository.create({
                uid: uid,
                cid: cid,
                count: count,
            });
        }
        await this._Repository.save(card);
    }

    /**
     * 批量添加卡牌到玩家库
     * @param uid 玩家 uid
     * @param cards 卡牌 cid 数组
     */
    async AddCards(ruid: number | string, cards: number[]): Promise<void> {
        let uid = typeof ruid === 'number' ? ruid : Number(ruid);

        // 聚合 cards 数组，统计每个 cid 的出现次数
        let cardCountMap = new Map<number, number>();
        for (const cid of cards) {
            cardCountMap.set(cid, (cardCountMap.get(cid) || 0) + 1);
        }

        // 构建批量插入数据
        let valuesToInsert = Array.from(cardCountMap.entries()).map(([cid, count]) => ({
            uid: uid, // 当前玩家 uid
            cid,
            count, // 本次该牌型新增的数量
        }));

        if (valuesToInsert.length === 0) return;

        let queryRunner = await this._Repository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (let i = 0; i < valuesToInsert.length; i += this.CHUNK_SIZE) {
                let chunk = valuesToInsert.slice(i, i + this.CHUNK_SIZE);

                // 构建参数化 SQL
                let params: any[] = [];
                let valuePlaceholders = chunk
                    .map((item, index) => {
                        return `(${item.uid}, ${item.cid}, ${item.count})`;
                    })
                    .join(', ')

                // 已有的卡牌直接累加
                let cmd = `
                INSERT INTO ${this.TableName} (uid, cid, count) 
                VALUES ${valuePlaceholders}
                ON CONFLICT (uid, cid) 
                DO UPDATE SET "count" = "${this.TableName}"."count" + EXCLUDED."count"
                `
                await queryRunner.query(cmd, params);
            }
            await queryRunner.commitTransaction();

        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * 获取玩家库中的所有卡牌
     * @param uid 玩家 uid
     * @returns 所有卡牌
     */
    async GetCardsByUID(uid: number|string): Promise<CardLibrary[]> {
        return await this._Repository.find({
            where: {
                uid: typeof uid === 'number' ? uid : Number(uid),
            },
            select: {
                cid: true,
                count: true,
            }
        });
    }
}