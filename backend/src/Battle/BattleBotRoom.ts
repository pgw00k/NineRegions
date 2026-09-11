import { Client } from "../net/Client";
import { BattlePlayer } from "./BattlePlayer";
import { BattlePlayerBot } from "./BattlePlayerBot";
import { BattleRoom } from "./BattleRoom";

/**
 * 用来模拟行为的对战房间
 */
export class BattleBotRoom extends BattleRoom {

    constructor() {
        super();

        // 自动新增一个机器人
        // 这里我在数据库默认创建了一个玩家ID=1和Deck=1
        this.SetBattler({did:1,client:undefined,uid:'Bot'},BattlePlayerBot);
    }

}