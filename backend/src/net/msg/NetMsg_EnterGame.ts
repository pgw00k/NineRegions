// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_EnterGame

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  EnterGameRequest,
  EnterGameResponse,
} from 'mc-local-share';

/**
 * NetMsg_EnterGame
 * REQ = EnterGameRequest
 * RES = EnterGameResponse
 * 注册：reqId=10001、recId=10002
 */
export class NetMsg_EnterGame implements IHandle<EnterGameRequest, EnterGameResponse> {
  /** 请求消息号：ENTER_GAME_REQ (10001) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.ENTER_GAME_REQ;
  /** 响应消息号：ENTER_GAME_REP (10002) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.ENTER_GAME_REP;

  Handle(req: EnterGameRequest): EnterGameResponse {
    return {
      error: 0,
      index: "测试文本",
      playerInfo: {
        name: "测试玩家",
        money: 3000,
        level: 50,
        exp: 300,
        diamond: 200,
        ash: 0,
        gender: 1,
        createTime: 1000,
        jade: 666,
        curTitle: "测试标题",
        curBackGround: 3,
        lastChangeNameTime: 300,
      },
      cardLibrary: {
        cards: [
          { cid: 10001,count: 3},
          { cid: 10002,count: 3},
          { cid: 10017,count: 3},
          { cid: 10018,count: 3},
          { cid: 10019,count: 3},
          { cid: 10020,count: 3},
          { cid: 10021,count: 3},
          { cid: 10022,count: 3},
          { cid: 10023,count: 3},
          { cid: 10025,count: 3},
          { cid: 10026,count: 3},
          { cid: 10028,count: 3},
          { cid: 10029,count: 3},
          { cid: 10112,count: 3},
          { cid: 10113,count: 3},
          { cid: 10122,count: 3},
          { cid: 10123,count: 3},
          { cid: 10124,count: 3},
        ],
        cardBacks: [8],
      },
      deckLibrary: {
        decks: [{
          did: 1,
          name: "测试牌组",
          hero: 101,
          job: 2,
          skill: 100000,
          cards: [10001,10001,10001,10002,10002,10017,10017,10018,10018,10018,10019,10019,10019,10020,10020,10020,10021,10021,10022,10022,10022,10023,10023,10023,10025,10025,10026,10026,10028,10112,10112,10113,10113,10122,10122,10124,10124,10124,10002],
          cardBack: 8,
        }],
        cardBack: 8,
      },
      heroLibrary: {
        heros: [{
          hero: 101,
        }],
        dailyFavors:[]
      },
      itemInfo: {
        items: [],
      },
      equipmentInfo: {
        equipments: [],
      },
      buffInfo: {
        buffs: [],
      },
      pveInfo: {
        chapters: [{
          cid: 1,
          isPassed: true,
          hasReward: true,
        }],
        stages: [
          {sid: 10001,isPassed: true},
          {sid: 10002,isPassed: true},
          {sid: 10003,isPassed: true},
        ],
        rewardedSections: [],
        buyInfo: {
          buyChapters: [],
          buySections: [],
          buyStageGroup: [],
          dlc4: false,
        },
      },
      ladderSeason:{
      },
      setting: {
        kanban: 3,
      },
      activity:[
      ],
      achieveInfo: [],
      heroEquips: [],
      loginActivity: [{
        id: 1,
        rewardIds: [],
        flag: false,
        waitForRewards: [],
        loginDays: 0,
      }],
      shopInfo: [],
      headPic: 1,
      headPicEx: 2,
      questionnaire: false,
      timestamp:{
        time: Date.now(),
        zone: 8,
      },
      champInfo: {
          id: 0,
          state: 0,
          exitTimes: 0,
          battleInfo: {
            winCount: 0,
            loseCount: 0,
            historyWin: 0,
            curRank: 0,
            totalWin: 0,
            historyLose: 0
          },
        },
      skinInfo: {
        skinList: [],
      },
    };
  }
}
