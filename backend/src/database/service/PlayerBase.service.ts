import { IPlayerBase } from "../data/IPlayerBase";
import { CardLibraryService } from "./CardLibrary.service";
import { DeckService } from "./Deck.service";
import { PlayerService } from "./Player.service";

import fs from "fs";

/**
 * 玩家基础信息服务
 * 用来处理玩家的基础信息，一般在首次连入或者重连后进行调用，走统一接口确保信息一致
 */
export class PlayerBaseService {
    static Instance = new PlayerBaseService();

    /**
     * 根据玩家ID获取玩家基础信息
     * 默认存在，不做存在性校验
     * @param uid 玩家ID
     * @returns 玩家基础信息
     */
    async GetPlayerBaseByUID(uid: string): Promise<IPlayerBase> {

        let player = await PlayerService.Instance.GetPlayerByID(uid);
        let decks = await DeckService.Instance.getPlayerDecks(uid);
        let cards = await CardLibraryService.Instance.GetCardsByUID(uid);

        /**
         * 先使用一个模拟数据来替代未完成的数据库内容
         */
        let resOrignal = JSON.parse(fs.readFileSync(`mocks/Base.json`, "utf-8"))
        if (resOrignal) {
            Object.assign(resOrignal.playerInfo!, player);
            Object.assign(resOrignal.deckLibrary?.decks!, decks);
            Object.assign(resOrignal.cardLibrary?.cards!, cards);
        }

        return resOrignal;

    }
}