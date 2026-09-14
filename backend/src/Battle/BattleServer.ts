import { BattleStartResponse, ChangeCardRequest, MESSAGE_ID, PushBattleWaiting, RoomType } from "mc-local-share";
import { Client } from "../net/Client";
import { BattleRoom } from "./BattleRoom";
import { Logger } from "../core/Logger";
import { BattleBotRoom } from "./BattleBotRoom";

/** 战斗服务器 */
export class BattleServer {

    public BattleRooms: Record<string, BattleRoom> = {};
    public BattlePlayers: Record<string, string> = {};
    public BattlePlayerDecks: Record<string, number> = {};

    public static Instance: BattleServer = new BattleServer();
    constructor() {
    }

    /**
     * 将客户端添加到匹配队列
     * @param client 客户端
     * @param did 组牌ID
     */
    public async PushClientToMatchQueue(client: Client, did: number) {

        /**
         * 记录玩家的牌组ID
         */
        this.BattlePlayerDecks[client.uid] = did;

        /**
         * 模拟匹配成功，发送等待确认的房间信息
         */
        setTimeout(() => {
            let roomInfo: PushBattleWaiting = {
                token: 'TestBattleToken-395085356',
                roomToken: 'TestRoom-395085356',
                roomType: RoomType.LADDER_ROOM,
                overtime: 30,
            }
            client.PushMessage(MESSAGE_ID.PUSH_BATTLEWAITING, roomInfo);

            /**
             * 这里改用BattleBotRoom类来模拟战斗信息
             * 正常战斗应当使用BattleRoom类
             */
            let roomCreateInfo = {
                RoomToken: roomInfo.roomToken!,
                BattleToken: roomInfo.token!,
            }
            // let room = new BattleRoom();
            let room = new BattleBotRoom(roomCreateInfo);
            this.BattleRooms[room.RoomToken] = room;
            Logger.LogInfo(`创建战斗房间：${room.RoomToken}`);

            this.BattlePlayers[client.uid] = roomInfo.roomToken!;
            Logger.LogInfo(`添加战斗玩家：${client.uid} to room ${room.RoomToken}`);
        }, 3000);
    }

    public async GetRoomByClient(client: Client): Promise<BattleRoom | undefined> {
        let roomToken = this.BattlePlayers[client.uid];
        let room = this.BattleRooms[roomToken] ?? undefined;
        if (!room) {
            Logger.LogWarn(`battle ${client.uid} 未找到房间房间 ${roomToken}`,this.BattlePlayers);
        }
        return room;
    }

    /**
     * 玩家准备战斗
     * @param client 客户端
     */
    public async PlayerReady(client: Client) {
        Logger.LogInfo(`玩家准备：${client.uid}`);
        let room = await this.GetRoomByClient(client);
        if (room) {

            /**
             * 都准备好了就开始战斗
             */
            let isReady = await room.SetBattler({ did: this.BattlePlayerDecks[client.uid], client: client });
            if (isReady >= 2) {
                // 已经将战斗消息移动到了Room中处理，这里预留一个口子看以后有没有用
            }

        }
    }

    /**
     * 玩家更换手牌
     * @param client 客户端
     * @param req 换手牌参数
     */
    public async ChangeCard(client: Client, req: ChangeCardRequest) {
        let room = await this.GetRoomByClient(client);
        if (room) {
            return room.ChangeCard(client.uid,req);
        }
        return undefined as any;
    }
}