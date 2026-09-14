import { FindOptionsSelect } from "typeorm";
import { PlayerInfo } from "../data/PlayerInfo";
import { BaseRepositoryTemplate } from "./BaseRepositoryTemplate";

/**
 * 玩家的额外详情信息
 */
export class PlayerInfoService extends BaseRepositoryTemplate<PlayerInfo> {

    static Instance: PlayerInfoService;

    constructor() {
        super(PlayerInfo);
        this._Template = this._Repository.create();
        PlayerInfoService.Instance = this;
    }

    GetPlayerInfoByID(uid: string, select?: FindOptionsSelect<PlayerInfo>): Promise<PlayerInfo | null> {
        return this._Repository.findOne({
            where: { uid: Number(uid) },
            select: select
        });
    }

}
