import { IHandle } from '../IHandle';
import {
    MESSAGE_ID,
    GetActitiviesRequest,
    GetActitiviesResponse,
} from 'mc-local-share';
import { NetMsg_ActivityInfo_CS } from '../msg/NetMsg_ActivityInfo_CS';
import { Logger } from '../../core/Logger';

/**
 * NetMsg_ActivityInfo_CS_Mod
 */
export class NetMsg_ActivityInfo_CS_Mod extends NetMsg_ActivityInfo_CS {
    override HandleSync(req: GetActitiviesRequest): GetActitiviesResponse {
        Logger.LogInfo('NetMsg_ActivityInfo_CS_Mod.Handle', req);
        
        // 提供丰富的模拟活动数据
        const fakeActivities = [
            {
                id: 1,
                type: 1,
                status: 1,
                startTime: Date.now() - 86400000,    // 一天前
                endTime: Date.now() + 86400000,      // 一天后
                title: "新手礼包",
                description: "恭喜新人加入游戏，领取丰厚奖励！",
                reward: [
                    { type: 1, id: 1, count: 50 },
                    { type: 2, id: 0, count: 200 }
                ]
            },
            {
                id: 2,
                type: 2,
                status: 1,
                startTime: Date.now() - 3600000,     // 一小时前
                endTime: Date.now() + 3600000,       // 一小时后
                title: "充值返利",
                description: "限时充值活动，最高返利50%！",
                reward: [
                    { type: 4, id: 1, count: 20 }
                ]
            },
            {
                id: 3,
                type: 3,
                status: 0,
                startTime: Date.now() - 86400000,    // 一天前
                endTime: Date.now() - 3600000,       // 一小时前  
                title: "已结束活动",
                description: "这个活动已经结束啦。"
            }
        ];

        const fakeData = [
            {
                id: 1,
                type: 1,
                value: 100
            },
            {
                id: 2,
                type: 2,
                value: 1000
            }
        ];

        const fakeTrade = [
            {
                id: 1,
                rewardCount: 100
            }
        ];

        return {
            activities: fakeActivities,
            data: fakeData,
            trade: fakeTrade
        };
    }
}
