import { BattleReconnectionResponse, BattleStartResponse, ChangeCardRequest, DeploymentCompleteRequest, ErrorCode, MESSAGE_ID, PushBattleWaiting, RoomType } from "mc-local-share";
import { Client } from "../net/Client";
import { BattleRoom } from "./BattleRoom";
import { Logger } from "../core/Logger";
import { BattleBotRoom } from "./BattleBotRoom";
import { BattleSnapshotStore } from "./BattleSnapshotStore";
import { DeserializeBattleRoom } from "./BattleSnapshot";
import { Config } from "../config/env";

/** 未打完的战斗对登录应答的回填字段（见 BattleRoom.Reconnect 的 20002 同源数据） */
export interface PendingBattleInfo {
    battleRoomType: RoomType;
    battleAccountToken: string;
    battleRoomToken: string;
    battleResult: number;
}

/** 战斗服务器 */
export class BattleServer {

    public BattleRooms: Record<string, BattleRoom> = {};
    public BattlePlayers: Record<string, string> = {};
    public BattlePlayerDecks: Record<string, number> = {};

    public static Instance: BattleServer = new BattleServer();
    constructor() {
    }

    /**
     * 【启动恢复】把上次进程留下的战斗房间快照读回内存。
     *
     * 这里**只重建状态、不发送任何消息**：快照里的参战者此刻还没有出站连接
     * （BattlePlayer.client 属连接期对象，不入快照），真正的「续跑」要等他的 20001
     * 到达、换绑 Client 之后由 BattleRoom.ResumeAfterRestore 触发。
     */
    public RestoreRooms(): void {
        let snapshots = BattleSnapshotStore.LoadAll();
        for (let snap of snapshots) {
            try {
                let room = DeserializeBattleRoom(snap.room) as BattleRoom;
                this.BattleRooms[room.RoomToken] = room;
                for (let uid of snap.uids) {
                    this.BattlePlayers[uid] = room.RoomToken;
                }
                Logger.LogInfo(
                    `恢复战斗房间：${room.RoomToken} 在线玩家=${snap.uids.join(',') || '无'}`
                );
            } catch (err) {
                Logger.LogError(`恢复战斗房间失败：${snap.roomToken}`, err);
            }
        }
        if (snapshots.length === 0) {
            Logger.LogInfo('无待恢复的战斗房间');
        }
    }

    /**
     * 该账号是否有一场没打完的战斗。
     *
     * 客户端在战斗中掉线后**不会**自发重试 20001：它走的是逻辑服软重连（10011→10012），
     * 由 10012 / 10002 里的 battle* 字段驱动 `BattleDataInterface.ReLoginBattleProcedure`
     * 重新拉起战斗场景，之后才发 20001。所以这个回填是「重启后续战」的必要条件。
     *
     * @param uid 账号 ID
     * @returns 有未结算战斗时返回回填字段，否则 undefined
     */
    public GetPendingBattle(uid: string): PendingBattleInfo | undefined {
        let roomToken = this.BattlePlayers[uid];
        if (!roomToken) {
            return undefined;
        }
        let room = this.BattleRooms[roomToken];
        if (!room || room.IsFinished()) {
            return undefined;
        }
        /**
         * battleAccountToken 填战斗 token 而非账号 token：客户端把它当 BattleToken 存
         * （SaveBattleTokenInfo），后续 20001 的信封 channel 用的就是这个值，
         * 与 25001 首次进战时 PUSH_BATTLEWAITING 下发的 token 同构。
         */
        return {
            battleRoomType: RoomType.LADDER_ROOM,
            battleAccountToken: room.BattleToken,
            battleRoomToken: room.RoomToken,
            battleResult: 0,
        };
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
            return undefined;
        }
        /**
         * 战斗中的 C2S 一律顺带补驱动一次「快照恢复后的机器人」。
         *
         * 客户端断线重连后不一定先发 20001：实测它会直接重发当时卡住的那条消息
         * （例如表现播完就发 25012）。恢复出来的房间缺的是机器人的定时器，
         * 不补驱动就会一直等对方，所以不能只在 Reconnect 里补。
         * ResumeAfterRestore 自带 once 语义，重复调用无副作用。
         */
        room.ResumeAfterRestore();
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

    /**
     * 玩家布阵完成（C2S 25006）
     *
     * 无独立应答（25006 没有对应的 REP），双方都提交后由房间广播 25007 + 25011。
     * @param client 客户端
     * @param req 布阵动作
     */
    public async DeploymentComplete(client: Client, req: DeploymentCompleteRequest) {
        let room = await this.GetRoomByClient(client);
        if (room) {
            return room.DeploymentComplete(client.uid, req);
        }
    }

    /**
     * 客户端播放完毕本轮表现（C2S 25012），推进到下一轮或结束战斗
     * @param client 客户端
     */
    public async ShowEnd(client: Client) {
        let room = await this.GetRoomByClient(client);
        if (room) {
            return room.ShowEnd(client.uid);
        }
    }

    /**
     * 战斗弱重连（C2S 20001）
     *
     * 客户端等待战斗消息超时时会**另建一条 WebSocket** 再发 20001，所以这里的 client 是一个
     * 全新的连接对象；房间实例仍活在内存里，交给房间换绑该玩家的出站 Client。
     * @param client 客户端（新连接）
     */
    public async Reconnect(client: Client): Promise<BattleReconnectionResponse> {
        let room = await this.GetRoomByClient(client);
        if (!room) {
            /** 快照只在启动时批量恢复；此处查不到说明快照过期、已被结算清除，或从未落盘 */
            Logger.LogWarn(`battle ${client.uid} 重连失败：内存中已无战斗房间（快照目录 ${Config.battleSnapshotDir}）`);
            return { error: ErrorCode.SESSION_NOT_FIND } as BattleReconnectionResponse;
        }
        return room.Reconnect(client.uid, client);
    }
}