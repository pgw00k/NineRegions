import { Player } from "../data/Player";
import { BaseRepositoryTemplate } from "./BaseRepositoryTemplate";

/**
 * 玩家服务类 - 处理玩家数据的CRUD操作和相关业务逻辑
 */
export class PlayerService extends BaseRepositoryTemplate<Player> {

    static Instance: PlayerService;

    constructor() {
        super(Player);
        this._Template = this._Repository.create();
        PlayerService.Instance = this;
    }

    GetPlayerByID(id: string): Promise<Player | null> {
        return this._Repository.findOne({
            where: { id }
        });
    }

}
