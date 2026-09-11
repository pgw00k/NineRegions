import { MESSAGE_ID } from "mc-local-share";
import { Logger } from "../core/Logger";
import { BattlePlayer } from "./BattlePlayer";

/**
 * 战斗玩家机器人
 * 用来模拟玩家
 */
export class BattlePlayerBot extends BattlePlayer {
    constructor(preset?: any) {
        super(preset);
    }

    override SendMessage(id: MESSAGE_ID, data: any): void {
        /**
         * 机器人不发送消息
         */
        Logger.LogInfo(`Bot SendMessage:${id} `);
    }

}