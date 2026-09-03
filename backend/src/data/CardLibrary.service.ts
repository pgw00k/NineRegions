import { DataSource, Repository } from 'typeorm';
import { CardLibrary } from './CardLibrary';

export class CardLibraryService {
    protected _Repo: Repository<CardLibrary>;

    constructor(protected readonly dataSource: DataSource) {
        this._Repo = dataSource.getRepository(CardLibrary);
    }

    /**
     * 原子增加卡牌数量（抽卡/合成）
     * 利用 MySQL 的 ON DUPLICATE KEY UPDATE 实现原子 upsert
     */
    async addCard(playerId: number, cardId: number, amount: number = 1): Promise<void> {
        await this.dataSource.query(
            `INSERT INTO player_collections (player_id, card_id, quantity)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
            [playerId, cardId, amount, amount],
        );
    }

    /**
     * 原子减少卡牌数量（分解/消耗）
     * 先扣减，再清理数量为 0 的冗余记录
     * @throws {Error} 当卡牌数量不足时抛出异常
     */
    async removeCard(playerId: number, cardId: number, amount: number = 1): Promise<void> {
        // 开启事务执行，保证扣减和删除的一致
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. 执行原子扣减（条件约束确保不会减到负数）
            const updateResult = await queryRunner.query(
                `UPDATE player_collections
                 SET quantity = quantity - ?
                 WHERE player_id = ? AND card_id = ? AND quantity >= ?`,
                [amount, playerId, cardId, amount],
            );

            // 2. 如果影响行数为 0，说明玩家没有这张卡或数量不足
            if (updateResult.affectedRows === 0) {
                // 通过查询确认是根本不存在还是数量不足（优化提示）
                const exists = await queryRunner.query(
                    `SELECT quantity FROM player_collections WHERE player_id = ? AND card_id = ?`,
                    [playerId, cardId],
                );
                if (exists.length === 0) {
                    throw new Error(`玩家 ${playerId} 未拥有卡牌 ${cardId}`);
                } else {
                    throw new Error(`玩家 ${playerId} 的卡牌 ${cardId} 数量不足 (当前: ${exists[0].quantity}, 需要: ${amount})`);
                }
            }

            // 3. 如果扣减后数量为 0，物理删除该条记录（保持表轻盈）
            await queryRunner.query(
                `DELETE FROM player_collections WHERE player_id = ? AND card_id = ? AND quantity <= 0`,
                [playerId, cardId],
            );

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * 查询玩家完整牌库（附带卡牌详情）
     * 这里利用 TypeORM 的 Relation 优势，方便返回前端展示
     */
    async getPlayerCollection(pid: number): Promise<CardLibrary[]> {
        return this._Repo.find({
            where: { pid },
        });
    }

    /**
     * 检查玩家是否拥有某张卡（及数量）
     */
    async getCardQuantity(pid: number, cid: number): Promise<number> {
        const result = await this._Repo.findOne({
            where: { pid, cid },
            select: { count: true },
        });
        return result?.count ?? 0;
    }
}