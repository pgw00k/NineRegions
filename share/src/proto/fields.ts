// 由 mc-local-share generate_ts 自动生成，请勿手改。
// 字段号/种类静态表：模块加载时经 schema.define 登记，供 codec 运行期编解码。

import { FieldType, WireType } from '../common';
import { define, FieldSchema } from '../schema';
import { MESSAGE_ID } from '../MESSAGE_ID';

define(0, 'BattleTarget', [
    { name: 'side', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'uid', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'Battlefield', [
    { name: 'side', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'index', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'CardRelated', [
    { name: 'uid', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cid', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cost', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'isMaterialized', number: 4, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'locationStatus', number: 5, kind: FieldType.ENUM, repeated: false, typeName: 'LocationStatus', wire: WireType.VARINT },
  ]);

define(0, 'Abilitie', [
    { name: 'skillId', number: 1, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'passiveSkillId', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'skillExpander', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'SkillExpander', wire: WireType.LENDELIM },
    { name: 'atk', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'curDef', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'maxDef', number: 6, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'isPrepare', number: 7, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'flyLayer', number: 8, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'auraSkillId', number: 9, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'SkillExpander', [
    { name: 'skillID', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'expander', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'DeployActionSimple', [
    { name: 'type', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ActionType', wire: WireType.VARINT },
    { name: 'index', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cardUid', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'field', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'Battlefield', wire: WireType.LENDELIM },
    { name: 'target', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'BattleTarget', wire: WireType.LENDELIM },
  ]);

define(0, 'Hit', [
    { name: 'field', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'Battlefield', wire: WireType.LENDELIM },
    { name: 'bufferId', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'hurt', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'card', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'CardRelated', wire: WireType.LENDELIM },
    { name: 'abilitie', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'Abilitie', wire: WireType.LENDELIM },
    { name: 'attacker', number: 6, kind: FieldType.MESSAGE, repeated: false, typeName: 'Battlefield', wire: WireType.LENDELIM },
  ]);

define(0, 'HeroInfo', [
    { name: 'side', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'heroID', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'heroSkillID', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'heroSkillCD', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'curMana', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'maxMana', number: 6, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'curHP', number: 7, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'maxHP', number: 8, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'atk', number: 9, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'handCount', number: 10, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'deckCount', number: 11, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cemeteryCount', number: 12, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'tmpMana', number: 13, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'Talk', [
    { name: 'field', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'Battlefield', wire: WireType.LENDELIM },
    { name: 'talkIDs', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'Action', [
    { name: 'b1', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'Battlefield', wire: WireType.LENDELIM },
    { name: 'b2', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'Battlefield', wire: WireType.LENDELIM },
    { name: 'skillId', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'attackType', number: 4, kind: FieldType.ENUM, repeated: false, typeName: 'AttackType', wire: WireType.VARINT },
    { name: 'hits', number: 5, kind: FieldType.MESSAGE, repeated: true, typeName: 'Hit', wire: WireType.LENDELIM },
    { name: 'isPassive', number: 6, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'heros', number: 7, kind: FieldType.MESSAGE, repeated: true, typeName: 'HeroInfo', wire: WireType.LENDELIM },
    { name: 'talk', number: 8, kind: FieldType.MESSAGE, repeated: false, typeName: 'Talk', wire: WireType.LENDELIM },
  ]);

define(0, 'BattleLogUnit', [
    { name: 'side', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'field', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cid', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'atk', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'def', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'maxDef', number: 6, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'isMaterialized', number: 7, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'activeSkills', number: 8, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'passiveSkills', number: 9, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'BattleLogParams', [
    { name: 'units', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'BattleLogUnit', wire: WireType.LENDELIM },
    { name: 'intParams', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'BattleLogSimple', [
    { name: 'type', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'BattleLogType', wire: WireType.VARINT },
    { name: 'side', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'BattleLogSide', wire: WireType.VARINT },
    { name: 'battleParams', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'BattleLogParams', wire: WireType.LENDELIM },
  ]);

define(0, 'IdPair', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'count', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'KickOut', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
  ]);

define(0, 'CommonError', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'bandMid', number: 2, kind: FieldType.UINT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'ClickStatistic', [
    { name: 'clickCount', number: 1, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'bannerCount', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'IdPair', wire: WireType.LENDELIM },
    { name: 'boardClick', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'IdPair', wire: WireType.LENDELIM },
  ]);

define(0, 'TimeStampSimple', [
    { name: 'time', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'zone', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.HEARTBEAT_REQ, 'HeartbeatReq', [
    { name: 'click', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'ClickStatistic', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.HEARTBEAT_REP, 'HeartbeatRep', [
    { name: 'timestamp', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'TimeStampSimple', wire: WireType.LENDELIM },
    { name: 'moduleFlags', number: 2, kind: FieldType.BOOL, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'RegisterRequest', [
    { name: 'username', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'password', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'version', number: 3, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'phoneType', number: 4, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'playerType', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'deviceID', number: 6, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(0, 'RegisterResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'username', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'password', number: 3, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(0, 'LoginRequest', [
    { name: 'username', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'password', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'version', number: 3, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(0, 'LoginResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'index', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'token', number: 3, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'host', number: 4, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'port', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'LoginBySDKRequest', [
    { name: 'userID', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'token', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'version', number: 3, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'phoneType', number: 4, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'deviceID', number: 5, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'activationCode', number: 6, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'timestamp', number: 7, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'playerType', number: 8, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'LoginBySDKResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'index', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'token', number: 3, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'host', number: 4, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'port', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'Logout', [
    { name: 'uid', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'token', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(0, 'AnnouncementRequest', []);

define(0, 'AnnouncementResponse', [
    { name: 'title', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'content', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'cardmd5', number: 3, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'pvemd5', number: 4, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(0, 'GuiderInfo', [
    { name: 'value', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.ENTER_GAME_REQ, 'EnterGameRequest', [
    { name: 'version', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'phoneType', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'deviceID', number: 3, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'osversion', number: 4, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'network', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cpuScore', number: 6, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'uid', number: 7, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'token', number: 8, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'channelID', number: 9, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'idfaImei', number: 10, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'phoneOS', number: 11, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cmgeSDKid', number: 12, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'language', number: 13, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.ENTER_GAME_REP, 'EnterGameResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'index', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'playerInfo', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PlayerInfoSimple', wire: WireType.LENDELIM },
    { name: 'cardLibrary', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'CardLibrarySimple', wire: WireType.LENDELIM },
    { name: 'deckLibrary', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'DeckLibrarySimple', wire: WireType.LENDELIM },
    { name: 'heroLibrary', number: 6, kind: FieldType.MESSAGE, repeated: false, typeName: 'HeroLibrarySimple', wire: WireType.LENDELIM },
    { name: 'itemInfo', number: 7, kind: FieldType.MESSAGE, repeated: false, typeName: 'ItemInfoSimple', wire: WireType.LENDELIM },
    { name: 'equipmentInfo', number: 8, kind: FieldType.MESSAGE, repeated: false, typeName: 'EquipmentInfoSimple', wire: WireType.LENDELIM },
    { name: 'buffInfo', number: 9, kind: FieldType.MESSAGE, repeated: false, typeName: 'ItemBuffInfo', wire: WireType.LENDELIM },
    { name: 'pveInfo', number: 10, kind: FieldType.MESSAGE, repeated: false, typeName: 'PVEInfoSimple', wire: WireType.LENDELIM },
    { name: 'ladderSeason', number: 11, kind: FieldType.MESSAGE, repeated: false, typeName: 'LadderSeasonSimple', wire: WireType.LENDELIM },
    { name: 'setting', number: 12, kind: FieldType.MESSAGE, repeated: false, typeName: 'SettingSimple', wire: WireType.LENDELIM },
    { name: 'activity', number: 13, kind: FieldType.MESSAGE, repeated: true, typeName: 'ActivitySimple', wire: WireType.LENDELIM },
    { name: 'guiderInfo', number: 14, kind: FieldType.MESSAGE, repeated: false, typeName: 'GuiderInfo', wire: WireType.LENDELIM },
    { name: 'battleRoomType', number: 15, kind: FieldType.ENUM, repeated: false, typeName: 'RoomType', wire: WireType.VARINT },
    { name: 'battleAccountToken', number: 16, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'battleRoomToken', number: 17, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'battleResult', number: 18, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'signInInfo', number: 19, kind: FieldType.MESSAGE, repeated: false, typeName: 'DailySignInInfo', wire: WireType.LENDELIM },
    { name: 'questionnaire', number: 20, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'achieveInfo', number: 21, kind: FieldType.MESSAGE, repeated: true, typeName: 'AchieveData', wire: WireType.LENDELIM },
    { name: 'timestamp', number: 22, kind: FieldType.MESSAGE, repeated: false, typeName: 'TimeStampSimple', wire: WireType.LENDELIM },
    { name: 'heroEquips', number: 23, kind: FieldType.MESSAGE, repeated: true, typeName: 'HeroEquipSimple', wire: WireType.LENDELIM },
    { name: 'loginActivity', number: 24, kind: FieldType.MESSAGE, repeated: true, typeName: 'LoginActivitySimple', wire: WireType.LENDELIM },
    { name: 'shopInfo', number: 25, kind: FieldType.MESSAGE, repeated: true, typeName: 'ShopSimpleInfo', wire: WireType.LENDELIM },
    { name: 'headPic', number: 26, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'headPicEx', number: 27, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'payInfo', number: 28, kind: FieldType.MESSAGE, repeated: false, typeName: 'PayInfo', wire: WireType.LENDELIM },
    { name: 'champInfo', number: 29, kind: FieldType.MESSAGE, repeated: false, typeName: 'ChampSimpleInfo', wire: WireType.LENDELIM },
    { name: 'firstCharge', number: 30, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'personalInfo', number: 31, kind: FieldType.MESSAGE, repeated: false, typeName: 'PersonalSimpleInfo', wire: WireType.LENDELIM },
    { name: 'expressionInfo', number: 32, kind: FieldType.MESSAGE, repeated: false, typeName: 'ExpressionInfo', wire: WireType.LENDELIM },
    { name: 'userTitleInfo', number: 33, kind: FieldType.MESSAGE, repeated: false, typeName: 'UserTitleInfo', wire: WireType.LENDELIM },
    { name: 'playerExtraInfo', number: 34, kind: FieldType.MESSAGE, repeated: false, typeName: 'PlayerExtraInfoSimple', wire: WireType.LENDELIM },
    { name: 'skinInfo', number: 35, kind: FieldType.MESSAGE, repeated: false, typeName: 'SkinInfo', wire: WireType.LENDELIM },
    { name: 'gildingInfo', number: 36, kind: FieldType.MESSAGE, repeated: false, typeName: 'GildingInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.MATCH_LADDERROOM_REQ, 'MatchLadderRoomRequest', [
    { name: 'did', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'type', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.MATCH_LADDERROOM_REP, 'MatchLadderRoomResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.EDIT_DECK_REQ, 'EditDeckRequest', [
    { name: 'deck', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'DeckSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.EDIT_DECK_REP, 'EditDeckResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'deck', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'DeckSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.DELETE_DECK_REQ, 'DeleteDeckRequest', [
    { name: 'did', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.DELETE_DECK_REP, 'DeleteDeckResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'did', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'EditDeckEquipRequest', [
    { name: 'deckID', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'equips', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'EditDeckEquipResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'deckID', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'BattleMatchStatus', [
    { name: 'status', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'type', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'RoomType', wire: WireType.VARINT },
  ]);

define(0, 'LogicReconnectionRequest', [
    { name: 'version', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'ip', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.LOGIC_RECONNECTION_REP, 'LogicReconnectionResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'index', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'needFlush', number: 3, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'playerInfo', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'PlayerInfoSimple', wire: WireType.LENDELIM },
    { name: 'cardLibrary', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'CardLibrarySimple', wire: WireType.LENDELIM },
    { name: 'deckLibrary', number: 6, kind: FieldType.MESSAGE, repeated: false, typeName: 'DeckLibrarySimple', wire: WireType.LENDELIM },
    { name: 'heroLibrary', number: 7, kind: FieldType.MESSAGE, repeated: false, typeName: 'HeroLibrarySimple', wire: WireType.LENDELIM },
    { name: 'itemInfo', number: 8, kind: FieldType.MESSAGE, repeated: false, typeName: 'ItemInfoSimple', wire: WireType.LENDELIM },
    { name: 'equipmentInfo', number: 9, kind: FieldType.MESSAGE, repeated: false, typeName: 'EquipmentInfoSimple', wire: WireType.LENDELIM },
    { name: 'buffInfo', number: 10, kind: FieldType.MESSAGE, repeated: false, typeName: 'ItemBuffInfo', wire: WireType.LENDELIM },
    { name: 'pveInfo', number: 11, kind: FieldType.MESSAGE, repeated: false, typeName: 'PVEInfoSimple', wire: WireType.LENDELIM },
    { name: 'battleRoomType', number: 12, kind: FieldType.ENUM, repeated: false, typeName: 'RoomType', wire: WireType.VARINT },
    { name: 'battleAccountToken', number: 13, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'battleRoomToken', number: 14, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'battleResult', number: 15, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'timestamp', number: 16, kind: FieldType.MESSAGE, repeated: false, typeName: 'TimeStampSimple', wire: WireType.LENDELIM },
    { name: 'heroEquips', number: 17, kind: FieldType.MESSAGE, repeated: true, typeName: 'HeroEquipSimple', wire: WireType.LENDELIM },
    { name: 'loginActivity', number: 24, kind: FieldType.MESSAGE, repeated: true, typeName: 'LoginActivitySimple', wire: WireType.LENDELIM },
    { name: 'shopInfo', number: 25, kind: FieldType.MESSAGE, repeated: true, typeName: 'ShopSimpleInfo', wire: WireType.LENDELIM },
    { name: 'payInfo', number: 26, kind: FieldType.MESSAGE, repeated: false, typeName: 'PayInfo', wire: WireType.LENDELIM },
    { name: 'champInfo', number: 27, kind: FieldType.MESSAGE, repeated: false, typeName: 'ChampSimpleInfo', wire: WireType.LENDELIM },
    { name: 'firstCharge', number: 28, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'personalInfo', number: 29, kind: FieldType.MESSAGE, repeated: false, typeName: 'PersonalSimpleInfo', wire: WireType.LENDELIM },
    { name: 'expressionInfo', number: 30, kind: FieldType.MESSAGE, repeated: false, typeName: 'ExpressionInfo', wire: WireType.LENDELIM },
    { name: 'userTitleInfo', number: 31, kind: FieldType.MESSAGE, repeated: false, typeName: 'UserTitleInfo', wire: WireType.LENDELIM },
    { name: 'playerExtraInfo', number: 32, kind: FieldType.MESSAGE, repeated: false, typeName: 'PlayerExtraInfoSimple', wire: WireType.LENDELIM },
    { name: 'data', number: 33, kind: FieldType.MESSAGE, repeated: true, typeName: 'AchieveData', wire: WireType.LENDELIM },
    { name: 'skinInfo', number: 34, kind: FieldType.MESSAGE, repeated: false, typeName: 'SkinInfo', wire: WireType.LENDELIM },
    { name: 'gildingInfo', number: 35, kind: FieldType.MESSAGE, repeated: false, typeName: 'GildingInfo', wire: WireType.LENDELIM },
    { name: 'matchStatus', number: 36, kind: FieldType.MESSAGE, repeated: false, typeName: 'BattleMatchStatus', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.CREATE_PVEROOM_REQ, 'CreatePVERoomRequest', [
    { name: 'did', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cid', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'sid', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.CREATE_PVEROOM_REP, 'CreatePVERoomResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.CANCEL_MATCH_REQ, 'CancelMatchRequest', [
    { name: 'roomType', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.CANCEL_MATCH_REP, 'CancelMatchResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'battleRoomType', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'RoomType', wire: WireType.VARINT },
    { name: 'battleAccountToken', number: 3, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'battleRoomToken', number: 4, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.SEASON_REWARD_REQ, 'SeasonRewardRequest', []);

define(MESSAGE_ID.SEASON_REWARD_REP, 'SeasonRewardResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'curSID', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'preSID', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'ladderLevel', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'prizeInfo', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GET_GIFTINFO_REQ, 'GetGiftInfoRequest', []);

define(MESSAGE_ID.GET_GIFTINFO_REP, 'GetGiftInfoResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'gifts', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'GiftInfoSimple', wire: WireType.LENDELIM },
    { name: 'delGifts', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'GiftInfoSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.RECEIVE_GIFT_REQ, 'ReceiveGiftRequest', [
    { name: 'mid', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.RECEIVE_GIFT_REP, 'ReceiveGiftResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'mid', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'prize', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'delGifts', number: 4, kind: FieldType.MESSAGE, repeated: true, typeName: 'GiftInfoSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'ChapterRewardRequest', [
    { name: 'cid', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'ChapterRewardResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'cid', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'prize', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.SECTION_REWARD_REQ, 'SectionRewardRequest', [
    { name: 'sectionID', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.SECTION_REWARD_REP, 'SectionRewardResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'sectionID', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'prize', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'EditSettingRequest', [
    { name: 'setting', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'SettingSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'EditSettingResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'setting', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'SettingSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'ExchangeGiftCodeRequest', [
    { name: 'giftCode', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(0, 'ExchangeGiftCodeResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.PUSH_PVECOMPLETE, 'PushPVEComplete', [
    { name: 'chapter', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'stage', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'prize', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'hero', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'HeroSimple', wire: WireType.LENDELIM },
    { name: 'buffInfo', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'ItemBuffInfo', wire: WireType.LENDELIM },
    { name: 'isWin', number: 6, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'dlc4', number: 7, kind: FieldType.MESSAGE, repeated: false, typeName: 'DLC4BattleResultInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.PUSH_LEVELUP, 'PushLevelup', [
    { name: 'levelup', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'LevelupSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.PUSH_LADDERCOMPLETE, 'PushLadderComplete', [
    { name: 'ladderSeason', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'LadderSeasonSimple', wire: WireType.LENDELIM },
    { name: 'dailyWin', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'upReward', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'hero', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'HeroSimple', wire: WireType.LENDELIM },
    { name: 'deck', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'DeckSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.BATTLE_READY_REQ, 'BattleReadyRequest', [
    { name: 'version', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(0, 'BattleStartResponse', [
    { name: 'roomType', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'RoomType', wire: WireType.VARINT },
    { name: 'token', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'roomToken', number: 3, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'waitingTime', number: 4, kind: FieldType.INT64, repeated: false, wire: WireType.VARINT },
    { name: 'enemyQuickBattle', number: 5, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'roundNum', number: 6, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'side', number: 7, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'battlers', number: 8, kind: FieldType.MESSAGE, repeated: true, typeName: 'BattlerSimple', wire: WireType.LENDELIM },
    { name: 'actions', number: 9, kind: FieldType.MESSAGE, repeated: true, typeName: 'Action', wire: WireType.LENDELIM },
    { name: 'infos', number: 10, kind: FieldType.MESSAGE, repeated: true, typeName: 'BattlerInfoSimple', wire: WireType.LENDELIM },
    { name: 'enemyID', number: 11, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'ChangeCardRequest', [
    { name: 'cardUids', number: 1, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'quickBattle', number: 2, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'ChangeCardResponse', [
    { name: 'changedCards', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'CardSimple_2', wire: WireType.LENDELIM },
    { name: 'quickBattle', number: 2, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'actions', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'Action', wire: WireType.LENDELIM },
    { name: 'selectedCards', number: 4, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'logs', number: 5, kind: FieldType.MESSAGE, repeated: true, typeName: 'BattleLogSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'DeploymentStartResponse', [
    { name: 'waitingTime', number: 1, kind: FieldType.INT64, repeated: false, wire: WireType.VARINT },
    { name: 'battlers', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'BattlerSimple', wire: WireType.LENDELIM },
    { name: 'logs', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'BattleLogSimple', wire: WireType.LENDELIM },
    { name: 'penaltyTimes', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'dealCached', number: 5, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'DeploymentCompleteRequest', [
    { name: 'action', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'DeployActionSimple', wire: WireType.LENDELIM },
    { name: 'penalty', number: 2, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'FightStartResponse', [
    { name: 'roundNum', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'battlers', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'BattlerSimple', wire: WireType.LENDELIM },
    { name: 'logs', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'BattleLogSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.BATTLE_EMOJI_REQ, 'BattleEmojiRequest', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.BATTLE_EMOJI_REP, 'BattleEmojiResponse', [
    { name: 'side', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'id', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.SET_AUTODEPLOY_REQ, 'SetAutoDeployRequest', [
    { name: 'autoDeploy', number: 1, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.SET_AUTODEPLOY_REP, 'SetAutoDeployResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'autoDeploy', number: 2, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'BattleReconnectionRequest', [
    { name: 'version', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'accountToken', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'ip', number: 3, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(0, 'BattleReconnectionResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'token', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'roomToken', number: 3, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'roomType', number: 4, kind: FieldType.ENUM, repeated: false, typeName: 'RoomType', wire: WireType.VARINT },
    { name: 'quickBattle', number: 5, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'roundNum', number: 6, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'step', number: 7, kind: FieldType.ENUM, repeated: false, typeName: 'StepType', wire: WireType.VARINT },
    { name: 'needFlush', number: 8, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'side', number: 9, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'selfWin', number: 10, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'enemyWin', number: 11, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'battlers', number: 12, kind: FieldType.MESSAGE, repeated: true, typeName: 'BattlerSimple', wire: WireType.LENDELIM },
    { name: 'infos', number: 13, kind: FieldType.MESSAGE, repeated: true, typeName: 'BattlerInfoSimple', wire: WireType.LENDELIM },
    { name: 'selectedCards', number: 14, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'waitingTime', number: 15, kind: FieldType.INT64, repeated: false, wire: WireType.VARINT },
    { name: 'enemyID', number: 16, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'logs', number: 17, kind: FieldType.MESSAGE, repeated: true, typeName: 'BattleLogSimple', wire: WireType.LENDELIM },
    { name: 'autoDeploy', number: 18, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'deployAction', number: 19, kind: FieldType.MESSAGE, repeated: true, typeName: 'DeployActionSimple', wire: WireType.LENDELIM },
    { name: 'penaltyTimes', number: 20, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'dealCached', number: 21, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.PUSH_BATTLEWAITING, 'PushBattleWaiting', [
    { name: 'token', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'roomToken', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'roomType', number: 3, kind: FieldType.ENUM, repeated: false, typeName: 'RoomType', wire: WireType.VARINT },
    { name: 'overtime', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.BATTLE_COMMONERROR_REP, 'BattleCommonError', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
  ]);

define(0, 'PlayerInfoSimple', [
    { name: 'name', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'money', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'level', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'exp', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'diamond', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'ash', number: 6, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'gender', number: 7, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'createTime', number: 8, kind: FieldType.INT64, repeated: false, wire: WireType.VARINT },
    { name: 'jade', number: 9, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'curTitle', number: 10, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'curBackGround', number: 11, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'lastChangeNameTime', number: 12, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'PlayerExtraInfoSimple', [
    { name: 'headPic', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'headPicEx', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'curtitleA', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'curtitleB', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'curbackGround', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'expressionSimple', number: 6, kind: FieldType.MESSAGE, repeated: false, typeName: 'ExpressionSimpleInfo', wire: WireType.LENDELIM },
    { name: 'buy_shopids', number: 7, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'cur_shortcut', number: 8, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'MoneySimple', [
    { name: 'gold', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'sliver', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'diamond', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'ash', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'jade', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'LevelInfoSimple', [
    { name: 'level', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'exp', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'CardLibrarySimple', [
    { name: 'cards', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'CardSimple', wire: WireType.LENDELIM },
    { name: 'cardBacks', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'CardSimple', [
    { name: 'cid', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'count', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'DeckLibrarySimple', [
    { name: 'decks', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'DeckSimple', wire: WireType.LENDELIM },
    { name: 'cardBack', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'DeckSimple', [
    { name: 'did', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'name', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'hero', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'job', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'skill', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cards', number: 6, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'equipSlot1', number: 7, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'equipSlot2', number: 8, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'equipSlot3', number: 9, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'equipSlot4', number: 10, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cardBack', number: 11, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'wins', number: 12, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'shared', number: 13, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'HeroSimple', [
    { name: 'hero', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'unlockState', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'favor', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'favorLv', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'curSkin', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'kanBanSkin', number: 6, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'HeroDailyFavor', [
    { name: 'hero', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'totalFavor', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'battleFavor', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'HeroFavorRewardInfo', [
    { name: 'rewardId', number: 1, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'HeroLibrarySimple', [
    { name: 'heros', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'HeroSimple', wire: WireType.LENDELIM },
    { name: 'dailyFavors', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'HeroDailyFavor', wire: WireType.LENDELIM },
    { name: 'rewardInfo', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'HeroFavorRewardInfo', wire: WireType.LENDELIM },
  ]);

define(0, 'ItemInfoSimple', [
    { name: 'items', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'ItemSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'ItemSimple', [
    { name: 'iid', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'count', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'updateTime', number: 3, kind: FieldType.INT64, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'EquipmentInfoSimple', [
    { name: 'equipments', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'EquipmentSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'EquipmentSimple', [
    { name: 'sid', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'eid', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'updateTime', number: 3, kind: FieldType.INT64, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'BufferInfoSimple', [
    { name: 'buffers', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'BufferSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'BufferSimple', [
    { name: 'bid', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'endTime', number: 2, kind: FieldType.INT64, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'PVEInfoSimple', [
    { name: 'chapters', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'ChapterSimple', wire: WireType.LENDELIM },
    { name: 'stages', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'StageSimple', wire: WireType.LENDELIM },
    { name: 'rewardedSections', number: 3, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'buyInfo', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'PVEBuyInfoSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'ChapterSimple', [
    { name: 'cid', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'isPassed', number: 2, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'hasReward', number: 3, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'StageSimple', [
    { name: 'sid', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'isPassed', number: 2, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'PVEBuyInfoSimple', [
    { name: 'buyChapters', number: 1, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'buySections', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'buyStageGroup', number: 3, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'dlc4', number: 4, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'PrizeInfoSimple', [
    { name: 'prize', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'PrizeSimple', wire: WireType.LENDELIM },
    { name: 'money', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'MoneySimple', wire: WireType.LENDELIM },
    { name: 'levelInfo', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'LevelInfoSimple', wire: WireType.LENDELIM },
    { name: 'cards', number: 4, kind: FieldType.MESSAGE, repeated: true, typeName: 'CardSimple', wire: WireType.LENDELIM },
    { name: 'items', number: 5, kind: FieldType.MESSAGE, repeated: true, typeName: 'ItemSimple', wire: WireType.LENDELIM },
    { name: 'equips', number: 6, kind: FieldType.MESSAGE, repeated: true, typeName: 'EquipmentSimple', wire: WireType.LENDELIM },
    { name: 'hero', number: 7, kind: FieldType.MESSAGE, repeated: false, typeName: 'HeroSimple', wire: WireType.LENDELIM },
    { name: 'cardBacks', number: 8, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'personalInfo', number: 9, kind: FieldType.MESSAGE, repeated: false, typeName: 'PersonalSimpleInfo', wire: WireType.LENDELIM },
    { name: 'expressionInfo', number: 10, kind: FieldType.MESSAGE, repeated: false, typeName: 'ExpressionInfo', wire: WireType.LENDELIM },
    { name: 'userTitleInfo', number: 11, kind: FieldType.MESSAGE, repeated: false, typeName: 'UserTitleInfo', wire: WireType.LENDELIM },
    { name: 'skinInfo', number: 12, kind: FieldType.MESSAGE, repeated: false, typeName: 'SkinInfo', wire: WireType.LENDELIM },
  ]);

define(0, 'PrizeSimple', [
    { name: 'itemId', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'count', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'LevelupSimple', [
    { name: 'level', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'prizeInfo', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'LadderSeasonSimple', [
    { name: 'sid', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'ladderLevel', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'ladderStar', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'meritPoint', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'dailyWinCount', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'historyBestLevel', number: 6, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'curBestLevel', number: 7, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'GiftInfoSimple', [
    { name: 'mid', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'title', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'content', number: 3, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'attachList', number: 4, kind: FieldType.MESSAGE, repeated: true, typeName: 'PrizeSimple', wire: WireType.LENDELIM },
    { name: 'expireTime', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'tmpId', number: 6, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'SettingSimple', [
    { name: 'backgroundMusic', number: 1, kind: FieldType.FLOAT, repeated: false, wire: WireType.FIXED32 },
    { name: 'soundEffect', number: 2, kind: FieldType.FLOAT, repeated: false, wire: WireType.FIXED32 },
    { name: 'kanban', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'disableBGM', number: 4, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'disableSE', number: 5, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'quickBattle', number: 6, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'ignoreQBRequest', number: 7, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'BattleFieldSimple', [
    { name: 'index', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'hasCard', number: 2, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'card', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'CardSimple_2', wire: WireType.LENDELIM },
    { name: 'orgIndex', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'CardSimple_2', [
    { name: 'uid', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cid', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cost', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'isMaterialized', number: 4, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'abilitie', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'Abilitie', wire: WireType.LENDELIM },
  ]);

define(0, 'BattlerSimple', [
    { name: 'heroInfo', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'HeroInfo', wire: WireType.LENDELIM },
    { name: 'hand', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'CardSimple_2', wire: WireType.LENDELIM },
    { name: 'battleFields', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'BattleFieldSimple', wire: WireType.LENDELIM },
    { name: 'deckIDs', number: 4, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'cemeteryIDs', number: 5, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'equipIDs', number: 6, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'BattlerInfoSimple', [
    { name: 'side', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'name', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'hero', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'job', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cardBack', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'ladderLv', number: 6, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'ladderStar', number: 7, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'meritPoint', number: 8, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'playerTitle', number: 9, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'skin', number: 10, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'gildingUse', number: 11, kind: FieldType.MESSAGE, repeated: true, typeName: 'GildingSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'TaskSimple', [
    { name: 'taskID', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'value', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'state', number: 3, kind: FieldType.ENUM, repeated: false, typeName: 'ETaskState', wire: WireType.VARINT },
    { name: 'group', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.TASK_REWARD_REQ, 'TaskRewardRequest', [
    { name: 'taskID', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.TASK_REWARD_REP, 'TaskRewardResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'taskID', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'prizeInfo', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'point', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'newTasks', number: 5, kind: FieldType.MESSAGE, repeated: true, typeName: 'TaskSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.TASK_DATA_REQ, 'TaskDataRequest', []);

define(MESSAGE_ID.TASK_DATA_REP, 'TaskDataResponse', [
    { name: 'list', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'TaskSimple', wire: WireType.LENDELIM },
    { name: 'taskPoint', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'TaskPointSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'TaskPointSimple', [
    { name: 'point', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'record', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.TASK_POINTREWARD_REQ, 'TaskPointRewardRequest', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.TASK_POINTREWARD_REP, 'TaskPointRewardResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'id', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'prizeInfo', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'ActivitySimple', [
    { name: 'actID', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'value', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'completeCount', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'LoginActivitySimple', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'rewardIds', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'flag', number: 3, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'waitForRewards', number: 4, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'loginDays', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'GuiderUpdateInfo', [
    { name: 'guideID', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'type', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'state', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.GUIDER_UPDATE_REQ, 'GuiderUpdateRequest', [
    { name: 'infoList', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'GuiderUpdateInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GUIDER_UPDATE_REP, 'GuiderUpdateResponse', []);

define(0, 'ChangeDeckNameRequest', [
    { name: 'did', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'name', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(0, 'ChangeDeckNameResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'did', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'name', number: 3, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.CHANGE_DEFAULT_CARDBACK_REQ, 'ChangeDefaultCardBackRequest', [
    { name: 'cardBack', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.CHANGE_DEFAULT_CARDBACK_REP, 'ChangeDefaultCardBackResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'cardBack', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.CHANGE_DECK_CARDBACK_REQ, 'ChangeDeckCardBackRequest', [
    { name: 'dids', number: 1, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'cardBack', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.CHANGE_DECK_CARDBACK_REP, 'ChangeDeckCardBackResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'dids', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'cardBack', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.CARD_RESOLVE_REQ, 'CardResolveRequest', [
    { name: 'cards', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'CardSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.CARD_RESOLVE_REP, 'CardResolveResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'request', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'CardSimple', wire: WireType.LENDELIM },
    { name: 'success', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'CardSimple', wire: WireType.LENDELIM },
    { name: 'getInfo', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'costInfo', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'deckInfo', number: 6, kind: FieldType.MESSAGE, repeated: false, typeName: 'DeckLibrarySimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.CARD_COMPOUND_REQ, 'CardCompoundRequest', [
    { name: 'cards', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'CardSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.CARD_COMPOUND_REP, 'CardCompoundResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'request', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'CardSimple', wire: WireType.LENDELIM },
    { name: 'success', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'CardSimple', wire: WireType.LENDELIM },
    { name: 'getInfo', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'costInfo', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'ItemBuffInfo', [
    { name: 'buffs', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'ItemBuffSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'ItemBuffSimple', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'leftCount', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.COOK_REQ, 'CookRequest', [
    { name: 'recipeId', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.COOK_REP, 'CookResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'recipeId', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'buffInfo', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'ItemBuffInfo', wire: WireType.LENDELIM },
    { name: 'costInfo', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'CookClearRequest', []);

define(0, 'CookClearResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'buffInfo', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'ItemBuffInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.USE_ITEM_REQ, 'UseItemRequest', [
    { name: 'item', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'ItemSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.USE_ITEM_REP, 'UseItemResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'getInfo', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'costInfo', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'buffInfo', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'ItemBuffInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.SET_PLAYERNAME_REQ, 'SetPlayerNameRequest', [
    { name: 'name', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'gender', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.SET_PLAYERNAME_REP, 'SetPlayerNameResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'name', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'gender', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'headPic', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'personalInfo', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'PersonalSimpleInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.CHANGE_PLAYERNAME_REQ, 'ChangePlayerNameRequest', [
    { name: 'name', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.CHANGE_PLAYERNAME_REP, 'ChangePlayerNameResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'name', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'change', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'lastChangeNameTime', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'DealStepResponse', [
    { name: 'roundNum', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'actions', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'Action', wire: WireType.LENDELIM },
    { name: 'logs', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'BattleLogSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'FightStepResponse', [
    { name: 'roundNum', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'actions', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'Action', wire: WireType.LENDELIM },
    { name: 'logs', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'BattleLogSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'BattleEndResponse', [
    { name: 'winInfo', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'roundNum', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'quit', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'SetGuiderRequest', [
    { name: 'value', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(0, 'SetGuiderResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'value', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GIVEMEFIVE_LOGIC_REQ, 'GiveMeFiveRequest', [
    { name: 'cmd', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'info', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GIVEMEFIVE_LOGIC_REP, 'GiveMeFiveResponse', [
    { name: 'result', number: 1, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'prizeInfo', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'playerInfo', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PlayerInfoSimple', wire: WireType.LENDELIM },
    { name: 'pveInfo', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'PVEInfoSimple', wire: WireType.LENDELIM },
    { name: 'ladderSeason', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'LadderSeasonSimple', wire: WireType.LENDELIM },
    { name: 'signInInfo', number: 6, kind: FieldType.MESSAGE, repeated: false, typeName: 'DailySignInInfo', wire: WireType.LENDELIM },
    { name: 'battlers', number: 7, kind: FieldType.MESSAGE, repeated: true, typeName: 'BattlerSimple', wire: WireType.LENDELIM },
    { name: 'heroInfo', number: 8, kind: FieldType.MESSAGE, repeated: false, typeName: 'HeroLibrarySimple', wire: WireType.LENDELIM },
    { name: 'battlePass', number: 9, kind: FieldType.MESSAGE, repeated: false, typeName: 'BattlePassResponse', wire: WireType.LENDELIM },
    { name: 'equipmentInfo', number: 10, kind: FieldType.MESSAGE, repeated: false, typeName: 'EquipmentInfoSimple', wire: WireType.LENDELIM },
    { name: 'buffInfo', number: 11, kind: FieldType.MESSAGE, repeated: false, typeName: 'ItemBuffInfo', wire: WireType.LENDELIM },
    { name: 'cmd', number: 12, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'get', number: 13, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'cost', number: 14, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'ArenaBattleCountInfo', [
    { name: 'winCount', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'loseCount', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'battleCount', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'ArenaHeroDeckInfo', [
    { name: 'combineId', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cards', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'ArenaCardSelectGroup', [
    { name: 'defineId', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'maxGroupIdx', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cards', number: 3, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.ARENA_ENTER_REQ, 'ArenaEnterRequest', []);

define(MESSAGE_ID.ARENA_ENTER_REP, 'ArenaEnterResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'state', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'EArenaState', wire: WireType.VARINT },
    { name: 'selectCombines', number: 3, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'countInfo', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'ArenaBattleCountInfo', wire: WireType.LENDELIM },
    { name: 'deckInfo', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'ArenaHeroDeckInfo', wire: WireType.LENDELIM },
    { name: 'groupInfo', number: 6, kind: FieldType.MESSAGE, repeated: false, typeName: 'ArenaCardSelectGroup', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.ARENA_BUY_TICKET_REQ, 'ArenaBuyTicketRequest', [
    { name: 'costPack', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'CostPack', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.ARENA_BUY_TICKET_REP, 'ArenaBuyTicketResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'state', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'EArenaState', wire: WireType.VARINT },
    { name: 'change', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'selectCombines', number: 4, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.ARENA_SELECT_HERO_REQ, 'ArenaSelectHeroRequest', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.ARENA_SELECT_HERO_REP, 'ArenaSelectHeroResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'state', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'EArenaState', wire: WireType.VARINT },
    { name: 'id', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'groupInfo', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'ArenaCardSelectGroup', wire: WireType.LENDELIM },
    { name: 'deckInfo', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'ArenaHeroDeckInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.ARENA_SELECT_CARDS_REQ, 'ArenaSelectCardsRequest', [
    { name: 'defineId', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'selectIdxs', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.ARENA_SELECT_CARDS_REP, 'ArenaSelectCardsResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'state', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'EArenaState', wire: WireType.VARINT },
    { name: 'defineId', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'groupInfo', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'ArenaCardSelectGroup', wire: WireType.LENDELIM },
    { name: 'deckInfo', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'ArenaHeroDeckInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.ARENA_GET_REWARDS_REQ, 'ArenaGetRewardRequest', []);

define(MESSAGE_ID.ARENA_GET_REWARDS_REP, 'ArenaGetRewardResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'state', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'EArenaState', wire: WireType.VARINT },
    { name: 'getInfo', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.ARENA_BATTLE_REQ, 'ArenaBattleRequest', []);

define(MESSAGE_ID.ARENA_BATTLE_REP, 'ArenaBattleResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.ARENA_BATTLE_COMPLETE, 'ArenaBattleComplete', [
    { name: 'state', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'EArenaState', wire: WireType.VARINT },
    { name: 'countInfo', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'ArenaBattleCountInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.ARENA_GIVEUP_REQ, 'ArenaGiveUpRequest', []);

define(MESSAGE_ID.ARENA_GIVEUP_REP, 'ArenaGiveUpResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'state', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'EArenaState', wire: WireType.VARINT },
  ]);

define(0, 'InfiAssets', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'count', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'InfiSingleStage', [
    { name: 'floor', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'index', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'type', number: 3, kind: FieldType.ENUM, repeated: false, typeName: 'EInfiStageType', wire: WireType.VARINT },
    { name: 'nextStages', number: 4, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'pathId', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'isRandomType', number: 6, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'InfiStageInfo', [
    { name: 'totalFloor', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'curStage', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiSingleStage', wire: WireType.LENDELIM },
    { name: 'canEnter', number: 3, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'stages', number: 4, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiSingleStage', wire: WireType.LENDELIM },
    { name: 'inBattle', number: 5, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'InfiHeroInfo', [
    { name: 'hero', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'job', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'level', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'exp', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'curHP', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'maxHP', number: 6, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'deckGroupId', number: 7, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'InfiTreasure', [
    { name: 'uniqueID', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'treasureID', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'leftCount', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'InfiItemInfo', [
    { name: 'silver', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'spellEquips', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiTreasure', wire: WireType.LENDELIM },
    { name: 'souls', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiTreasure', wire: WireType.LENDELIM },
    { name: 'badSouls', number: 4, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiTreasure', wire: WireType.LENDELIM },
  ]);

define(0, 'InfiEventOpt', [
    { name: 'index', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'eventOptID', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'param1', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'param2', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'valid', number: 5, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'success', number: 6, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'InfiEventInfo', [
    { name: 'eventID', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'opts', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiEventOpt', wire: WireType.LENDELIM },
  ]);

define(0, 'InfiShopCard', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'baseCost', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'realCost', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'InfiShopInfo', [
    { name: 'cards', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiShopCard', wire: WireType.LENDELIM },
    { name: 'upCardCount', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'freeUpCount', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'InfiShopItem', [
    { name: 'slot', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'id', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'sold', number: 3, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'InfiOpenShopInfo', [
    { name: 'items', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiShopItem', wire: WireType.LENDELIM },
    { name: 'buyCount', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'refreshCount', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'InfiInnInfo', [
    { name: 'delCardCount', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'freeDelCount', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'canRecover', number: 3, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'InfiBoxInfo', [
    { name: 'rewards', number: 1, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'InfiGlobalData', [
    { name: 'upCardCount', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'delCardCount', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'freeUpCount', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'freeDelCount', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'InfiScoreDetail', [
    { name: 'scoreId', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'count', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'score', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'InfiScoreInfo', [
    { name: 'totalScore', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'details', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiScoreDetail', wire: WireType.LENDELIM },
  ]);

define(0, 'InfiStaticData', [
    { name: 'unlockDifficulty', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'unlockMessages', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'passDifficulty', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'unlockEvents', number: 4, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'appearMainStoryEvents', number: 5, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'unlockDeckGroups', number: 6, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'OptionParam', [
    { name: 'param1', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'param2', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_ENTER_REQ, 'InfiEnterRequest', [
    { name: 'resetFlag', number: 1, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_ENTER_REP, 'InfiEnterResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'round', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'state', number: 3, kind: FieldType.ENUM, repeated: false, typeName: 'EInfiState', wire: WireType.VARINT },
    { name: 'selectJobs', number: 4, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'selectHeros', number: 5, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'cards', number: 6, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'stageInfo', number: 7, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiStageInfo', wire: WireType.LENDELIM },
    { name: 'heroInfo', number: 8, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiHeroInfo', wire: WireType.LENDELIM },
    { name: 'itemInfo', number: 9, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiItemInfo', wire: WireType.LENDELIM },
    { name: 'globalData', number: 10, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiGlobalData', wire: WireType.LENDELIM },
    { name: 'shopInfo', number: 11, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiOpenShopInfo', wire: WireType.LENDELIM },
    { name: 'passDifficulty', number: 12, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'selectDifficulty', number: 13, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'selectedDeckGroups', number: 14, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_SELECT_JOB_REQ, 'InfiSelectJobRequest', [
    { name: 'job', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_SELECT_JOB_REP, 'InfiSelectJobResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'state', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'EInfiState', wire: WireType.VARINT },
    { name: 'job', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'selectHeros', number: 4, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_SELECT_HERO_REQ, 'InfiSelectHeroRequest', [
    { name: 'hero', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_SELECT_HERO_REP, 'InfiSelectHeroResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'state', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'EInfiState', wire: WireType.VARINT },
    { name: 'hero', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'heroInfo', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiHeroInfo', wire: WireType.LENDELIM },
    { name: 'selectedDeckGroups', number: 5, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_SELECT_DECK_REQ, 'InfiSelectDeckRequest', [
    { name: 'deckGroupId', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_SELECT_DECK_REP, 'InfiSelectDeckResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'state', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'EInfiState', wire: WireType.VARINT },
    { name: 'deckGroupId', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'itemInfo', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiItemInfo', wire: WireType.LENDELIM },
    { name: 'stageInfo', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiStageInfo', wire: WireType.LENDELIM },
    { name: 'heroInfo', number: 6, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiHeroInfo', wire: WireType.LENDELIM },
    { name: 'globalData', number: 7, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiGlobalData', wire: WireType.LENDELIM },
    { name: 'cards', number: 8, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'shopInfo', number: 9, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiOpenShopInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.INFI_SELECT_EVENT_REQ, 'InfiSelectEventRequest', [
    { name: 'index', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'optList', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'OptionParam', wire: WireType.LENDELIM },
    { name: 'giveup', number: 3, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_SELECT_EVENT_REP, 'InfiSelectEventResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'state', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'EInfiState', wire: WireType.VARINT },
    { name: 'index', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'optList', number: 4, kind: FieldType.MESSAGE, repeated: true, typeName: 'OptionParam', wire: WireType.LENDELIM },
    { name: 'itemInfo', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiItemInfo', wire: WireType.LENDELIM },
    { name: 'heroInfo', number: 6, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiHeroInfo', wire: WireType.LENDELIM },
    { name: 'cards', number: 7, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'costInfo', number: 8, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'get', number: 9, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiAssets', wire: WireType.LENDELIM },
    { name: 'cost', number: 10, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiAssets', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.INFI_SELECT_STAGE_REQ, 'InfiSelectStageRequest', [
    { name: 'index', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_SELECT_STAGE_REP, 'InfiSelectStageResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'state', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'EInfiState', wire: WireType.VARINT },
    { name: 'index', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'stageInfo', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiStageInfo', wire: WireType.LENDELIM },
    { name: 'eventInfo', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiEventInfo', wire: WireType.LENDELIM },
    { name: 'shopInfo', number: 6, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiShopInfo', wire: WireType.LENDELIM },
    { name: 'innInfo', number: 7, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiInnInfo', wire: WireType.LENDELIM },
    { name: 'boxInfo', number: 8, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiBoxInfo', wire: WireType.LENDELIM },
    { name: 'globalData', number: 9, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiGlobalData', wire: WireType.LENDELIM },
    { name: 'enemyId', number: 10, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_UP_CARD_REQ, 'InfiUpCardRequest', [
    { name: 'cardID', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_UP_CARD_REP, 'InfiUpCardResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'state', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'EInfiState', wire: WireType.VARINT },
    { name: 'cardID', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cards', number: 4, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'itemInfo', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiItemInfo', wire: WireType.LENDELIM },
    { name: 'shopUpCount', number: 6, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'globalData', number: 7, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiGlobalData', wire: WireType.LENDELIM },
    { name: 'costInfo', number: 8, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'get', number: 9, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiAssets', wire: WireType.LENDELIM },
    { name: 'cost', number: 10, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiAssets', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.INFI_DEL_CARD_REQ, 'InfiDelCardRequest', [
    { name: 'cardID', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_DEL_CARD_REP, 'InfiDelCardResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'state', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'EInfiState', wire: WireType.VARINT },
    { name: 'cardID', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cards', number: 4, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'itemInfo', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiItemInfo', wire: WireType.LENDELIM },
    { name: 'innDelCount', number: 6, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'globalData', number: 7, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiGlobalData', wire: WireType.LENDELIM },
    { name: 'costInfo', number: 8, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'get', number: 9, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiAssets', wire: WireType.LENDELIM },
    { name: 'cost', number: 10, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiAssets', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.INFI_BUY_ITEM_REQ, 'InfiBuyItemRequest', [
    { name: 'type', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'itemID', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'param', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'slot', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_BUY_ITEM_REP, 'InfiBuyItemResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'state', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'EInfiState', wire: WireType.VARINT },
    { name: 'itemID', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'param', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'slot', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cards', number: 6, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'itemInfo', number: 7, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiItemInfo', wire: WireType.LENDELIM },
    { name: 'globalData', number: 8, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiGlobalData', wire: WireType.LENDELIM },
    { name: 'costInfo', number: 9, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'get', number: 10, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiAssets', wire: WireType.LENDELIM },
    { name: 'cost', number: 11, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiAssets', wire: WireType.LENDELIM },
  ]);

define(0, 'BattleReward', [
    { name: 'silver', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cards', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'items', number: 3, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'InfiBattleSource', [
    { name: 'stageType', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'EInfiStageType', wire: WireType.VARINT },
    { name: 'enemyID', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'param', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_BATTLE_COMPLETE, 'InfiBattleComplete', [
    { name: 'state', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'EInfiState', wire: WireType.VARINT },
    { name: 'isWin', number: 2, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'source', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiBattleSource', wire: WireType.LENDELIM },
    { name: 'heroInfo', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiHeroInfo', wire: WireType.LENDELIM },
    { name: 'reward', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'BattleReward', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.INFI_SELECT_REWARD_REQ, 'InfiSelectRewardRequest', [
    { name: 'type', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'option', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'OptionParam', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.INFI_SELECT_REWARD_REP, 'InfiSelectRewardResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'state', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'EInfiState', wire: WireType.VARINT },
    { name: 'type', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cards', number: 4, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'itemInfo', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiItemInfo', wire: WireType.LENDELIM },
    { name: 'heroInfo', number: 6, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiHeroInfo', wire: WireType.LENDELIM },
    { name: 'globalData', number: 7, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiGlobalData', wire: WireType.LENDELIM },
    { name: 'costInfo', number: 8, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'getInfo', number: 9, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'get', number: 10, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiAssets', wire: WireType.LENDELIM },
    { name: 'cost', number: 11, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiAssets', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.INFI_RECOVER_REQ, 'InfiRecoverRequest', []);

define(MESSAGE_ID.INFI_RECOVER_REP, 'InfiRecoverResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'heroInfo', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiHeroInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.INFI_EXIT_STAGE_REQ, 'InfiExitStageRequest', []);

define(MESSAGE_ID.INFI_EXIT_STAGE_REP, 'InfiExitStageResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'state', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'EInfiState', wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_GET_BOX_REQ, 'InfiGetBoxRequest', [
    { name: 'slotIndex', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_GET_BOX_REP, 'InfiGetBoxResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'state', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'EInfiState', wire: WireType.VARINT },
    { name: 'itemInfo', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiItemInfo', wire: WireType.LENDELIM },
    { name: 'get', number: 4, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiAssets', wire: WireType.LENDELIM },
    { name: 'cost', number: 5, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiAssets', wire: WireType.LENDELIM },
  ]);

define(0, 'InfiAssetsChange', [
    { name: 'get', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiAssets', wire: WireType.LENDELIM },
    { name: 'cost', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiAssets', wire: WireType.LENDELIM },
  ]);

define(0, 'InfiReplaceTreasureRequest', [
    { name: 'srcID', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'dstID', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'InfiReplaceTreasureResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'itemInfo', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiItemInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.INFI_DEL_SPELLEQUIP_REQ, 'InfiDelSpellEquipRequest', [
    { name: 'slotIndex', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_DEL_SPELLEQUIP_REP, 'InfiDelSpellEquipResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'slotIndex', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_STATE_CHANGE_PUSH, 'InfiStateChangePush', [
    { name: 'curHP', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'maxHP', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'silver', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.PUSH_INFI_ROUND_END, 'InfiRoundEndPush', [
    { name: 'curRound', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'isPassed', number: 2, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'scoreInfo', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiScoreInfo', wire: WireType.LENDELIM },
    { name: 'historyState', number: 4, kind: FieldType.ENUM, repeated: false, typeName: 'InfiScoreState', wire: WireType.VARINT },
    { name: 'get', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'difficulty', number: 6, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_UNLOCK_DIFFICULTY_REQ, 'InfiUnlockDifficultyReq', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'costPack', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'CostPack', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.INFI_UNLOCK_DIFFICULTY_REP, 'InfiUnlockDifficultyRep', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'id', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'change', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.INFI_BUY_MESSAGE_REQ, 'InfiBuyMessageReq', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'costPack', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'CostPack', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.INFI_BUY_MESSAGE_REP, 'InfiBuyMessageRep', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'id', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'change', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.INFI_UNLOCK_EVENT_REQ, 'InfiUnlockEventReq', [
    { name: 'eventId', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'costPack', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'CostPack', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.INFI_UNLOCK_EVENT_REP, 'InfiUnlockEventRep', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'eventId', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'change', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.INFI_SELECT_DIFFICULTY_REQ, 'InfiSelectDifficultyReq', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_SELECT_DIFFICULTY_REP, 'InfiSelectDifficultyRep', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'state', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'EInfiState', wire: WireType.VARINT },
    { name: 'selectId', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'heroInfo', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiHeroInfo', wire: WireType.LENDELIM },
    { name: 'itemInfo', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiItemInfo', wire: WireType.LENDELIM },
    { name: 'stageInfo', number: 6, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiStageInfo', wire: WireType.LENDELIM },
    { name: 'cards', number: 7, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'shopInfo', number: 8, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiOpenShopInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.INFI_GET_STATICDATA_REQ, 'InfiGetStaticDataReq', []);

define(MESSAGE_ID.INFI_GET_STATICDATA_REP, 'InfiGetStaticDataRep', [
    { name: 'data', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiStaticData', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.INFI_REFRESH_OPENSHOP_REQ, 'InfiRefreshOpenShopReq', [
    { name: 'costPack', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'CostPack', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.INFI_REFRESH_OPENSHOP_REP, 'InfiRefreshOpenShopRep', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'shop', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiOpenShopInfo', wire: WireType.LENDELIM },
    { name: 'change', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.INFI_OPEN_SHOP_BUY_REQ, 'InfiOpenShopBuyRequest', [
    { name: 'slot', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_OEPN_SHOP_BUY_REP, 'InfiOpenShopBuyResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'slot', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'get', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiAssets', wire: WireType.LENDELIM },
    { name: 'cost', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.INFI_OPENSHOP_EXIT_REQ, 'InfiOpenShopExitRequest', []);

define(MESSAGE_ID.INFI_OPENSHOP_EXIT_REP, 'InfiOpenShopExitResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'state', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'EInfiState', wire: WireType.VARINT },
    { name: 'stageInfo', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiStageInfo', wire: WireType.LENDELIM },
    { name: 'cards', number: 4, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'itemInfo', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiItemInfo', wire: WireType.LENDELIM },
  ]);

define(0, 'InfiUnlockData', [
    { name: 'unlockJobs', number: 1, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'unlockCards', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'unlockEvents', number: 3, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'unlockTreasures', number: 4, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'unlockDifficulty', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'unlockDeckGroups', number: 6, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_GET_SIMPLE_DATA_REQ, 'InfiGetSimpleDataRequest', []);

define(MESSAGE_ID.INFI_GET_SIMPLE_DATA_REP, 'InfiGetSimpleDataResponse', [
    { name: 'unlockData', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiUnlockData', wire: WireType.LENDELIM },
  ]);

define(0, 'DailySignInInfo', [
    { name: 'nextSignInId', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'lastSignInTime', number: 2, kind: FieldType.INT64, repeated: false, wire: WireType.VARINT },
    { name: 'signInCount', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'canSign', number: 4, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.DAILY_SIGNIN_REQ, 'DailySignInRequest', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.DAILY_SIGNIN_REP, 'DailySignInResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'info', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'DailySignInInfo', wire: WireType.LENDELIM },
    { name: 'reward', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GET_SIGNIN_INFO_REQ, 'GetSignInInfoRequest', []);

define(MESSAGE_ID.GET_SIGNIN_INFO_REP, 'GetSignInInfoResponse', [
    { name: 'info', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'DailySignInInfo', wire: WireType.LENDELIM },
  ]);

define(0, 'ActivityEventData', [
    { name: 'actID', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'eventID', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'value', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'completeCount', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'ActivityInfo', [
    { name: 'actID', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'status', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'ActivityStatus', wire: WireType.VARINT },
    { name: 'openTime', number: 3, kind: FieldType.INT64, repeated: false, wire: WireType.VARINT },
    { name: 'extendTime', number: 4, kind: FieldType.INT64, repeated: false, wire: WireType.VARINT },
    { name: 'closeTime', number: 5, kind: FieldType.INT64, repeated: false, wire: WireType.VARINT },
    { name: 'resetTime', number: 6, kind: FieldType.INT64, repeated: false, wire: WireType.VARINT },
    { name: 'point', number: 7, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'totalPoint', number: 8, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'ActivityTradeInfo', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'rewardCount', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.GET_ACTIVITIES_REQ, 'GetActitiviesRequest', []);

define(MESSAGE_ID.GET_ACTIVITIES_REP, 'GetActitiviesResponse', [
    { name: 'activities', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'ActivityInfo', wire: WireType.LENDELIM },
    { name: 'data', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'ActivityEventData', wire: WireType.LENDELIM },
    { name: 'trade', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'ActivityTradeInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GET_ACTIVITY_REWARD_REQ, 'GetActivityRewardRequest', [
    { name: 'actID', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'eventID', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'costPack', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'CostPack', wire: WireType.LENDELIM },
    { name: 'otherIDs', number: 4, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.GET_ACTIVITY_REWARD_REP, 'GetActivityRewardResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'actID', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'eventID', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'data', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'ActivityEventData', wire: WireType.LENDELIM },
    { name: 'get', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'cost', number: 6, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'point', number: 7, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'totalPoint', number: 8, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'change', number: 9, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'otherDatas', number: 10, kind: FieldType.MESSAGE, repeated: true, typeName: 'ActivityEventData', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GET_ACTIVITY_TRADE_REWARD_REQ, 'GetActivityTradeRewardRequest', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.GET_ACTIVITY_TRADE_REWARD_REP, 'GetActivityTradeRewardResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'info', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'ActivityTradeInfo', wire: WireType.LENDELIM },
    { name: 'get', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'cost', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.ACT_EVENT_DATA_PUSH, 'ActivityEventDataPush', [
    { name: 'data', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'ActivityEventData', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GET_LOGIN_ACTIVITY_REP, 'GetLoginActivityDataRep', [
    { name: 'data', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'LoginActivitySimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GET_LOGIN_ACTIVITY_REWARD_REQ, 'GetLoginActivityRewardReq', [
    { name: 'groupId', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.GET_LOGIN_ACTIVITY_REWARD_REP, 'GetLoginActivityRewardRep', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'groupId', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'rewardIds', number: 3, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'data', number: 4, kind: FieldType.MESSAGE, repeated: true, typeName: 'LoginActivitySimple', wire: WireType.LENDELIM },
    { name: 'get', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'ShopSimpleInfo', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'buyCount', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'totalBuyCount', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'type', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'floorCounts', number: 5, kind: FieldType.MESSAGE, repeated: true, typeName: 'FloorCount', wire: WireType.LENDELIM },
  ]);

define(0, 'FloorCount', [
    { name: 'rarity', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'count', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'PersonalSimpleInfo', [
    { name: 'headPic_list', number: 1, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'headPicEx_list', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'ShortcutInfo', [
    { name: 'index', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'id', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'ExpressionSimpleInfo', [
    { name: 'shortcut_1', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'ShortcutInfo', wire: WireType.LENDELIM },
    { name: 'shortcut_2', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'ShortcutInfo', wire: WireType.LENDELIM },
    { name: 'shortcut_3', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'ShortcutInfo', wire: WireType.LENDELIM },
  ]);

define(0, 'ExpressionInfo', [
    { name: 'expressionList', number: 1, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'UserTitleInfo', [
    { name: 'userTitleList', number: 1, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'backGroundList', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'skinData', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'overdueTimes', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'SkinInfo', [
    { name: 'skinList', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'skinData', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GET_SHOP_INFO_REQ, 'GetShopInfoRequest', [
    { name: 'type', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.GET_SHOP_INFO_REP, 'GetShopInfoResponse', [
    { name: 'type', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'info', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'ShopSimpleInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.SHOP_BUY_REQ, 'ShopBuyRequest', [
    { name: 'type', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'buyID', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'buyCount', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'couponBuyCount', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'costPack', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'CostPack', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.SHOP_RMB_BUY_PUSH, 'ShopBuyResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'type', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'buyID', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'buyCount', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'items', number: 5, kind: FieldType.MESSAGE, repeated: true, typeName: 'ItemInfoSimple', wire: WireType.LENDELIM },
    { name: 'change', number: 6, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'shopInfo', number: 7, kind: FieldType.MESSAGE, repeated: true, typeName: 'ShopSimpleInfo', wire: WireType.LENDELIM },
  ]);

define(0, 'QuestionnaireData', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'choice', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'content', number: 3, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GET_QUESTION_REQ, 'GetQuestionnaireRequest', []);

define(MESSAGE_ID.GET_QUESTION_REP, 'GetQuestionnaireResponse', [
    { name: 'data', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'QuestionnaireData', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.UPDATE_QUESTION_REQ, 'UpdateQuestionnaireRequest', [
    { name: 'isCommit', number: 1, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'data', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'QuestionnaireData', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.ANNOUNCE_LAMP_PUSH, 'AnnounceLamp', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'content', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'circleTimes', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'priority', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'paras', number: 5, kind: FieldType.STRING, repeated: true, wire: WireType.LENDELIM },
    { name: 'twcontent', number: 6, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'isGmSend', number: 7, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'endTime', number: 8, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'AnnounceLampCancel', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'AchieveData', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'value', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'reward', number: 3, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.GET_ACHIEVE_INFO_REQ, 'GetAchieveInfoRequest', []);

define(MESSAGE_ID.GET_ACHIEVE_INFO_REP, 'GetAchieveInfoResponse', [
    { name: 'data', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'AchieveData', wire: WireType.LENDELIM },
    { name: 'point', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.GET_ACHIEVE_REWARD_REQ, 'GetAchieveRewardRequest', [
    { name: 'idList', number: 1, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.GET_ACHIEVE_REWARD_REP, 'GetAchieveRewardResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'reqIds', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'success', number: 3, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'get', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'point', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'addAchi', number: 6, kind: FieldType.MESSAGE, repeated: true, typeName: 'AchieveData', wire: WireType.LENDELIM },
  ]);

define(0, 'StorySkip', [
    { name: 'storyID', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'RankCommonDisplayData', [
    { name: 'rank', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'uid', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'name', number: 3, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'score', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'userTitle', number: 5, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'background', number: 6, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'headPic', number: 7, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'headPicEx', number: 8, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'LadderRankSimple', [
    { name: 'common', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'RankCommonDisplayData', wire: WireType.LENDELIM },
    { name: 'ladderLv', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'ladderExp', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'ladderPoint', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'InfiRankSimple', [
    { name: 'common', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'RankCommonDisplayData', wire: WireType.LENDELIM },
    { name: 'isWin', number: 2, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'difficulty', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'ChampRankSimple', [
    { name: 'common', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'RankCommonDisplayData', wire: WireType.LENDELIM },
    { name: 'win', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'lose', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.GET_RANK_REQ, 'GetRankRequest', [
    { name: 'rankType', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'begin', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'end', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.GET_RANK_REP, 'GetRankResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'rankType', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'beginIdx', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'endIdx', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'selfRank', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'selfScore', number: 6, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'ladder', number: 7, kind: FieldType.MESSAGE, repeated: true, typeName: 'LadderRankSimple', wire: WireType.LENDELIM },
    { name: 'infi', number: 8, kind: FieldType.MESSAGE, repeated: true, typeName: 'InfiRankSimple', wire: WireType.LENDELIM },
    { name: 'selfInfi', number: 9, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiRankSimple', wire: WireType.LENDELIM },
    { name: 'champ', number: 10, kind: FieldType.MESSAGE, repeated: true, typeName: 'ChampRankSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GET_RANK_DETAIL_REQ, 'GetRankDetailRequest', [
    { name: 'rankType', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'uid', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GET_RANK_DETAIL_REP, 'GetRankDetailResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'rankType', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'uid', number: 3, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'ladder', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'LadderRankDetail', wire: WireType.LENDELIM },
    { name: 'infi', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiRankDetail', wire: WireType.LENDELIM },
    { name: 'champ', number: 6, kind: FieldType.MESSAGE, repeated: false, typeName: 'ChampRankDetail', wire: WireType.LENDELIM },
  ]);

define(0, 'LadderRankDetail', [
    { name: 'common', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'RankCommonDisplayData', wire: WireType.LENDELIM },
    { name: 'hero', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'job', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cards', number: 4, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'ladderLv', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'ladderExp', number: 6, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'ladderPoint', number: 7, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'skin', number: 8, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'InfiRankDetail', [
    { name: 'common', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'RankCommonDisplayData', wire: WireType.LENDELIM },
    { name: 'hero', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'job', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cards', number: 4, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'spellEquips', number: 5, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'souls', number: 6, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'badSouls', number: 7, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'isWin', number: 8, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'floor', number: 9, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'enemyName', number: 10, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'difficulty', number: 11, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'scoreExtra', number: 12, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'scoreInfo', number: 13, kind: FieldType.MESSAGE, repeated: false, typeName: 'InfiScoreInfo', wire: WireType.LENDELIM },
    { name: 'skin', number: 14, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'ChampRankDetail', [
    { name: 'common', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'RankCommonDisplayData', wire: WireType.LENDELIM },
    { name: 'win', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'lose', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'GetRPGInfoResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'characters', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'RPGCharacterSimple', wire: WireType.LENDELIM },
    { name: 'equipments', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'RPGEquipmentSimple', wire: WireType.LENDELIM },
    { name: 'chapters', number: 4, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'stages', number: 5, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'expedition', number: 6, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'RPGCharacterSimple', [
    { name: 'cid', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'level', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'exp', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'equipSlot1', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'equipSlot2', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'equipSlot3', number: 6, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'equipSlot4', number: 7, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'equipSlot5', number: 8, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'equipSlot6', number: 9, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'usable', number: 10, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'RPGEquipmentSimple', [
    { name: 'sid', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'eid', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'equipped', number: 3, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'EditCharacterRequest', [
    { name: 'character', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'RPGCharacterSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'EditCharacterResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'character', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'RPGCharacterSimple', wire: WireType.LENDELIM },
    { name: 'equipments', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'RPGEquipmentSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'EditExpeditionRequest', [
    { name: 'expedition', number: 1, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'EditExpeditionResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'expedition', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'PlayStoryRequest', [
    { name: 'chapter', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'stage', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'characters', number: 3, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'PlayStoryResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'token', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'roomToken', number: 3, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'stageType', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'PVESkipRequest', [
    { name: 'cid', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'sid', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'hero', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'job', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'PVESkipResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
  ]);

define(0, 'PushRPGInfo', [
    { name: 'characters', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'RPGCharacterSimple', wire: WireType.LENDELIM },
    { name: 'equipments', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'RPGEquipmentSimple', wire: WireType.LENDELIM },
    { name: 'chapters', number: 3, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'stages', number: 4, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.CHALLENGE_HERO_REQ, 'ChallengeHeroRequest', [
    { name: 'hero', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'deckId', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.CHALLENGE_HERO_REP, 'ChallengeHeroResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'hero', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'token', number: 3, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'roomToken', number: 4, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.CHALLENGE_HERO_COMPLETE, 'ChallengeHeroComplete', [
    { name: 'heroSimple', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'HeroSimple', wire: WireType.LENDELIM },
    { name: 'buffInfo', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'ItemBuffInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.PUSH_HERO_INFO, 'PushHeroSimpleInfo', [
    { name: 'heroSimple', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'HeroSimple', wire: WireType.LENDELIM },
    { name: 'dailyFavors', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'HeroDailyFavor', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.HERO_GIVE_GIFT_REQ, 'HeroGiveGiftRequest', [
    { name: 'hero', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'itemId', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'count', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.HERO_GIVE_GIFT_REP, 'HeroGiveGiftResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'heroSimple', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'HeroSimple', wire: WireType.LENDELIM },
    { name: 'dailyFavor', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'HeroDailyFavor', wire: WireType.LENDELIM },
    { name: 'cost', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GET_FAVOR_REWARD_REQ, 'GetFavorRewardRequest', [
    { name: 'hero', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'favorRewardId', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.GET_FAVOR_REWARD_REP, 'GetFavorRewardResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'hero', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'favorRewardId', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'reward', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'rewardInfo', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'HeroFavorRewardInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.SET_HERO_SKIN_REQ, 'SetHeroSkinRequest', [
    { name: 'hero', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'skin', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.SET_HERO_SKIN_REQ, 'SetHeroSkinResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'hero', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'skin', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.TIPS_NOTICE, 'TipsNotice', [
    { name: 'tp', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'val', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'val2', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'val3', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'BattlePassInfo', [
    { name: 'bpState', number: 1, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'level', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'exp', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'bpPayExp', number: 4, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'BattlePassQuest', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'count', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'val', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.BATTLEPASS_REQ, 'BattlePassRequest', []);

define(MESSAGE_ID.BATTLEPASS_REP, 'BattlePassResponse', [
    { name: 'info', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'BattlePassInfo', wire: WireType.LENDELIM },
    { name: 'freeRewardFlag', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'rewardFlag', number: 3, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'quest', number: 4, kind: FieldType.MESSAGE, repeated: true, typeName: 'BattlePassQuest', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.BATTLEPASS_REWARD_REQ, 'BattlePassRewardRequest', [
    { name: 'lv', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'free', number: 2, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.BATTLEPASS_REWARD_REP, 'BattlePassRewardResponse', [
    { name: 'freeRewardFlag', number: 1, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'rewardFlag', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'reward', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'error', number: 4, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.BATTLEPASS_BUY_EXP_REQ, 'BattlePassBuyExpRequest', [
    { name: 'lv', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'costPack', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'CostPack', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.BATTLEPASS_BUY_EXP_REP, 'BattlePassBuyExpResponse', [
    { name: 'level', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'exp', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'error', number: 3, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'diamondCost', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'change', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'BattlePassActiveRequest', []);

define(MESSAGE_ID.BATTLEPASS_ACTIVE_REP, 'BattlePassActiveResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'info', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'BattlePassInfo', wire: WireType.LENDELIM },
  ]);

define(0, 'BattleRecordUnit', [
    { name: 'msgid', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'msgInfo', number: 2, kind: FieldType.BYTES, repeated: false, wire: WireType.LENDELIM },
  ]);

define(0, 'BattleRecord', [
    { name: 'battleInfo', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'BattleRecordUnit', wire: WireType.LENDELIM },
  ]);

define(0, 'FriendInfo', [
    { name: 'uid', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'ufid', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'name', number: 3, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'headPic', number: 4, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'createTime', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'level', number: 6, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'gender', number: 7, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'guildName', number: 8, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'ladderRank', number: 9, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'staticCardCount', number: 10, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'staticLadderHistory', number: 11, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'staticRankHistory', number: 12, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'staticInfiHistory', number: 13, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'offlineTime', number: 14, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'state', number: 15, kind: FieldType.ENUM, repeated: false, typeName: 'EFriendState', wire: WireType.VARINT },
    { name: 'cur_headPic', number: 16, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cur_headPicEx', number: 17, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cur_UserTitle', number: 18, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'cur_BackGround', number: 19, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'language', number: 20, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'InviteFriendInfo', [
    { name: 'createTime', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'info', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'FriendInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.FRIEND_INFO_RPT, 'FriendInfoRpt', []);

define(MESSAGE_ID.FRIEND_INFO_NTF, 'FriendInfoNtf', [
    { name: 'self', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'FriendInfo', wire: WireType.LENDELIM },
    { name: 'invite', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'InviteFriendInfo', wire: WireType.LENDELIM },
    { name: 'other', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'FriendInfo', wire: WireType.LENDELIM },
    { name: 'search_list', number: 4, kind: FieldType.MESSAGE, repeated: true, typeName: 'FriendInfo', wire: WireType.LENDELIM },
    { name: 'last_refresh_time', number: 5, kind: FieldType.INT64, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.FRIEND_BEHAVIOR_RPT, 'FriendBehaviorRpt', [
    { name: 'tp', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'EFriendBehaviorOp', wire: WireType.VARINT },
    { name: 'ufid', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'did', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'fast', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.FRIEND_BEHAVIOR_NTF, 'FriendBehaviorNtf', [
    { name: 'tp', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'EFriendBehaviorOp', wire: WireType.VARINT },
    { name: 'ufid', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'info', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'FriendInfo', wire: WireType.LENDELIM },
    { name: 'over_fightwait_time', number: 4, kind: FieldType.INT64, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.FRIEND_STATE_NTF, 'FriendStateNtf', [
    { name: 'uid', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'state', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'EFriendState', wire: WireType.VARINT },
    { name: 'offlineTime', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.FRIEND_OP_STATUS_NTF, 'FriendOpStatusNtf', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'battleAccountToken', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'battleRoomToken', number: 3, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.FRIEND_REFRESH_SREARCH_NTF, 'FriendRefreshRearchNtf', [
    { name: 'info', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'FriendInfo', wire: WireType.LENDELIM },
    { name: 'refresh_time', number: 2, kind: FieldType.INT64, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.FRIEND_REFRESH_SCENE_RPT, 'FriendRefreshScenceRpt', [
    { name: 'scene', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'FriendSceneState', wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.INFI_GET_STORY_REQ, 'GetInfiStoryRequest', []);

define(MESSAGE_ID.INFI_GET_STORY_REP, 'GetInfiStoryResponse', [
    { name: 'storyEvents', number: 1, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'HeroEquipSimple', [
    { name: 'hero', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'equips', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.MODIFY_EQUIP_REQ, 'ModifyEquipRequest', [
    { name: 'hero', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'equips', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'equipType', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.MODIFY_EQUIP_REP, 'ModifyEquipResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'heroEquip', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'HeroEquipSimple', wire: WireType.LENDELIM },
    { name: 'equipType', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'ModifyDeckCardsRequest', [
    { name: 'deckId', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'deckName', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'job', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'hero', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'modifyCards', number: 5, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'cards', number: 6, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'ModifyDeckCardsResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'deck', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'DeckSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'ChatContent', [
    { name: 'from', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'to', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'content', number: 3, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'tp', number: 4, kind: FieldType.ENUM, repeated: false, typeName: 'ChatType', wire: WireType.VARINT },
    { name: 'createTime', number: 5, kind: FieldType.INT64, repeated: false, wire: WireType.VARINT },
    { name: 'type', number: 6, kind: FieldType.ENUM, repeated: false, typeName: 'ContentType', wire: WireType.VARINT },
    { name: 'info', number: 7, kind: FieldType.MESSAGE, repeated: false, typeName: 'RecordBaseInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.CHAT_INFO_RPT, 'ChatInfoRpt', [
    { name: 'tp', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.CHAT_INFO_NTF, 'ChatInfoNtf', [
    { name: 'content', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'ChatContent', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.TRANS_CHAT_INFO_RPT, 'TransChatInfoRpt', [
    { name: 'content', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'ChatContent', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.TRANS_CHAT_INFO_NTF, 'TransChatInfoNtf', [
    { name: 'content', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'ChatContent', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.SET_HEAD_PIC_REQ, 'SetHeadPicReq', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.SET_HEAD_PIC_RSP, 'SetHeadPicRsp', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'id', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.SET_HEAD_PIC_EX_REQ, 'SetHeadPicExReq', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.SET_HEAD_PIC_EX_RSP, 'SetHeadPicExRsp', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'id', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'SetHeadFaceRpt', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'url', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(0, 'ClientLuaResponse', [
    { name: 'lua', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GET_DECKCODE_REQ, 'GetDeckCodeReq', [
    { name: 'deck', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'DeckSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GET_DECKCODE_REP, 'GetDeckCodeRep', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'code', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GET_DECKDATA_REQ, 'GetDeckDataReq', [
    { name: 'code', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GET_DECKDATA_REP, 'GetDeckDataRep', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'deck', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'DeckSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'SharedDeckInfoSimple', [
    { name: 'id', number: 1, kind: FieldType.INT64, repeated: false, wire: WireType.VARINT },
    { name: 'uid', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'name', number: 3, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'headPic', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'headPicEx', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'tag', number: 6, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'uploadTime', number: 7, kind: FieldType.INT64, repeated: false, wire: WireType.VARINT },
    { name: 'usageCount', number: 8, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'code', number: 9, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'hero', number: 10, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'job', number: 11, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.GET_SHAREDDECKS_REQ, 'GetSharedDecksReq', []);

define(MESSAGE_ID.GET_SHAREDDECKS_REP, 'GetSharedDecksRep', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'infos', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'SharedDeckInfoSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.SHAREDECK_REQ, 'ShareDeckReq', [
    { name: 'did', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'tag', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.SHAREDECK_REP, 'ShareDeckRep', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'deck', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'DeckSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.USE_SHAREDDECK_NT, 'UseSharedDeckNt', [
    { name: 'id', number: 1, kind: FieldType.INT64, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.PUSH_PRIZE_INFO, 'PushPrizeInfo', [
    { name: 'get', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'cost', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.PUSH_NOTICE_RSP, 'PushNoticeRsp', [
    { name: 'info', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.QUERY_PERSONAL_INFO_REQ, 'QueryPersonalInfoReq', []);

define(MESSAGE_ID.QUERY_PERSONAL_INFO_RSP, 'QueryPersonalInfoRsp', [
    { name: 'info', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'PersonalSimpleInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.QUERY_EXPRESSION_INFO_REQ, 'QueryExpressionInfoReq', []);

define(MESSAGE_ID.QUERY_EXPRESSION_INFO_RSP, 'QueryExpressionInfoRsp', [
    { name: 'info', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'ExpressionInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.SET_EXPRESSION_SHORTCUT_REQ, 'SetExpressionShortcutReq', [
    { name: 'index', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'location', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'id', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.SET_EXPRESSION_SHORTCUT_RSP, 'SetExpressionShortcutRsp', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'index', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'shortcuts', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'ShortcutInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.UNLOAD_EXPRESSION_SHORTCUT_REQ, 'UnloadExpressionShortcutReq', [
    { name: 'index', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'location', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.UNLOAD_EXPRESSION_SHORTCUT_RSP, 'UnloadExpressionShortcutRsp', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'index', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'shortcuts', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'ShortcutInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.CLEAR_EXPRESSION_SHORTCUT_REQ, 'ClearExpressionShortcutReq', [
    { name: 'index', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.CLEAR_EXPRESSION_SHORTCUT_RSP, 'ClearExpressionShortcutRsp', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'index', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.SET_DEFAULT_SHORTCUT_REQ, 'SetDefaultShortcutReq', [
    { name: 'index', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.SET_DEFAULT_SHORTCUT_RSP, 'SetDefaultShortcutRsp', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'index', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.QUERY_USERTITLE_INFO_REQ, 'QueryUserTitelInfoReq', []);

define(MESSAGE_ID.QUERY_USERTITLE_INFO_RSP, 'QueryUserTitelInfoRsp', [
    { name: 'info', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'UserTitleInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.SET_USERTITLE_REQ, 'SetUserTitleReq', [
    { name: 'titleA', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'titleB', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'backGround', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.SET_USERTITLE_RSP, 'SetUserTitleRsp', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'title', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'backGround', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'titleA', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'titleB', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'PayInfo', [
    { name: 'payProducts', number: 1, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.PAY_REP, 'PayResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'productId', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'get', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'info', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'PayInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.FIRSTCHARGE_PUSH, 'FirstChargePush', [
    { name: 'firstCharge', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.FIRSTCHARGEREWARD_REQ, 'FirstChargeRewardReq', []);

define(MESSAGE_ID.FIRSTCHARGEREWARD_REP, 'FirstChargeRewardRep', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'get', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'firstCharge', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.PVE_BUY_PUSH, 'PveBuyPush', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'productId', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'buyInfo', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PVEBuyInfoSimple', wire: WireType.LENDELIM },
    { name: 'change', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'CostPack', [
    { name: 'type', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'CostType', wire: WireType.VARINT },
    { name: 'cost1', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cost2', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'transferCount', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.PVE_BUY_REQ, 'PveBuyRequest', [
    { name: 'buyType', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'buyId', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'costPack', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'CostPack', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.PVE_BUY_REP, 'PveBuyResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'buyType', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'buyId', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'change', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'buyInfo', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'PVEBuyInfoSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'DailyMatchupSimple', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'rewardTimes', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'passedStage', number: 3, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'DailyPveSimple', [
    { name: 'matchup', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'DailyMatchupSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GET_DAILYPVEINFO_REQ, 'GetDailyPveInfoRequest', []);

define(MESSAGE_ID.GET_DAILYPVEINFO_REP, 'GetDailyPveInfoResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'simple', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'DailyPveSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.QUERY_EXPRESSION_SHORECUT_REQ, 'QueryExpressionShortcutReq', []);

define(MESSAGE_ID.QUERY_EXPRESSION_SHORECUT_RSP, 'QueryExpressionShortcutRsp', [
    { name: 'shortcuts', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'ShortcutInfo', wire: WireType.LENDELIM },
  ]);

define(0, 'ActivityPveSimple', [
    { name: 'chapters', number: 1, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'passedStages', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.GET_ACTIVITY_PVE_INFO_REQ, 'GetActivityPveInfoReq', [
    { name: 'activity_id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.GET_ACTIVITY_PVE_INFO_RSP, 'GetActivityPveInfoRsp', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'pve_info', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'ActivityPveSimple', wire: WireType.LENDELIM },
    { name: 'activity_id', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'ChampSimpleInfo', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'state', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'exitTimes', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'battleInfo', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'ChampBattleInfo', wire: WireType.LENDELIM },
  ]);

define(0, 'ChampBattleInfo', [
    { name: 'winCount', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'loseCount', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'historyWin', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'curRank', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'totalWin', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'historyLose', number: 6, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'ChampRewardInfo', [
    { name: 'winRewards', number: 1, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'winExtraRewards', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'rankReward', number: 3, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'ChampDeckInfo', [
    { name: 'limitDeckId', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'deckLibrary', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'DeckLibrarySimple', wire: WireType.LENDELIM },
  ]);

define(0, 'ChampInfo', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'state', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'exitTimes', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'battleInfo', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'ChampBattleInfo', wire: WireType.LENDELIM },
    { name: 'rewardInfo', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'ChampRewardInfo', wire: WireType.LENDELIM },
    { name: 'deckInfo', number: 6, kind: FieldType.MESSAGE, repeated: false, typeName: 'ChampDeckInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.CHAMP_GET_INFO_REQ, 'ChampGetInfoRequest', []);

define(MESSAGE_ID.CHAMP_GET_INFO_REP, 'ChampGetInfoResponse', [
    { name: 'info', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'ChampInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.CHAMP_BUYTICKET_REQ, 'ChampBuyTicketRequest', [
    { name: 'costPack', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'CostPack', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.CHAMP_BUYTICKET_REP, 'ChampBuyTicketResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'info', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'ChampInfo', wire: WireType.LENDELIM },
    { name: 'change', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.CHAMP_EDIT_DECK_REQ, 'ChampEditDeckRequest', [
    { name: 'deck', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'DeckSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.CHAMP_EDIT_DECK_REP, 'ChampEditDeckResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'deck', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'DeckSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.CHAMP_DEL_DECK_REQ, 'ChampDelDeckRequest', [
    { name: 'did', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.CHAMP_DEL_DECK_REP, 'ChampDelDeckResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'did', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.CHAMP_BATTLE_REQ, 'ChampBattleRequest', [
    { name: 'did', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.CHAMP_BATTLE_REP, 'ChampBattleResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.CHAMP_GET_WINREWARD_REQ, 'ChampGetWinRewardRequest', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.CHAMP_GET_WINREWARD_REP, 'ChampGetWinRewardResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'id', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'rewardInfo', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'ChampRewardInfo', wire: WireType.LENDELIM },
    { name: 'change', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.CHAMP_GET_RANKREWARD_REQ, 'ChampGetRankRewardRequest', []);

define(MESSAGE_ID.CHAMP_GET_RANKREWARD_REP, 'ChampGetRankRewardResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'change', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.CHAMP_BATTLE_COMPLETE, 'ChampBattleComplete', [
    { name: 'id', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'state', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'battleInfo', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'ChampBattleInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.SET_HEAD_INFO_REQ, 'SetHeadInfoReq', [
    { name: 'headPic', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'headPicEx', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.SET_HEAD_INFO_RSP, 'SetHeadInfoRsp', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'headPic', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'headPicEx', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'SteamDLCCheckReq', []);

define(0, 'SteamDLCCheckRsp', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.QUERY_FAIL_CHARGE_ORDERID_REQ, 'QueryFailChargeOrderIDReq', []);

define(MESSAGE_ID.QUERY_FAIL_CHARGE_ORDERID_RSP, 'QueryFailChargeOrderIDRsp', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'OrderID', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'status', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'QuerySkinInfoReq', []);

define(0, 'QuerySkinInfoRsp', [
    { name: 'info', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'SkinInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.USE_SKIN_REQ, 'UseSkinReq', [
    { name: 'heroID', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'skinID', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'isKanBan', number: 3, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.USE_SKIN_RSP, 'UseSkinRsp', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'heroID', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'skinID', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'isKanBan', number: 4, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'GildingSimple', [
    { name: 'gildingId', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cardGroups', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'GildingInfo', [
    { name: 'gildingList', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'GildingSimple', wire: WireType.LENDELIM },
    { name: 'useList', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'GildingSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GILDING_REQ, 'GildingRequest', [
    { name: 'gildingId', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'cards', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'costPack', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'CostPack', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GILDING_REP, 'GildingResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'gildingId', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'change', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'simple', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'GildingSimple', wire: WireType.LENDELIM },
    { name: 'simpleUse', number: 5, kind: FieldType.MESSAGE, repeated: true, typeName: 'GildingSimple', wire: WireType.LENDELIM },
    { name: 'cards', number: 6, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.GILDING_RESET_REQ, 'GildingResetRequest', [
    { name: 'cards', number: 1, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.GILDING_RESET_REP, 'GildingResetResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'cards', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'useList', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'GildingSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'CardMakeTimeData', [
    { name: 'Open', number: 1, kind: FieldType.INT64, repeated: false, wire: WireType.VARINT },
    { name: 'End', number: 2, kind: FieldType.INT64, repeated: false, wire: WireType.VARINT },
    { name: 'CompoundItem', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'CompoundItemNumber', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'ResolveGetItem', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'ResolveGetItemNumber', number: 6, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'CardMakeData', [
    { name: 'cardID', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'datas', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'CardMakeTimeData', wire: WireType.LENDELIM },
  ]);

define(0, 'BattlePassRateData', [
    { name: 'ID', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'Rate', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'Open', number: 3, kind: FieldType.INT64, repeated: false, wire: WireType.VARINT },
    { name: 'End', number: 4, kind: FieldType.INT64, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'RecordBaseInfo', [
    { name: 'code', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'roomType', number: 2, kind: FieldType.ENUM, repeated: false, typeName: 'RoomType', wire: WireType.VARINT },
    { name: 'roundCount', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'battleTime', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'battlers', number: 5, kind: FieldType.MESSAGE, repeated: true, typeName: 'RecordBattlerInfo', wire: WireType.LENDELIM },
  ]);

define(0, 'RecordBattlerInfo', [
    { name: 'uid', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'name', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'side', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'hero', number: 4, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'job', number: 5, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'win', number: 6, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.GET_RECORDLIST_REQ, 'GetRecordListRequest', []);

define(MESSAGE_ID.GET_RECORDLIST_REP, 'GetRecordListResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'recentRecords', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'RecordBaseInfo', wire: WireType.LENDELIM },
    { name: 'favorRecords', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'RecordBaseInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GET_RECORDINFO_REQ, 'GetRecordInfoRequest', [
    { name: 'code', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GET_RECORDINFO_REP, 'GetRecordInfoResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'code', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'info', number: 3, kind: FieldType.MESSAGE, repeated: false, typeName: 'RecordBaseInfo', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.GET_RECORDDATA_REQ, 'GetRecordDataRequest', [
    { name: 'code', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'side', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.GET_RECORDDATA_REP, 'GetRecordDataResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'record', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'BattleRecord', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.FAVOR_RECORD_REQ, 'FavorRecordRequest', [
    { name: 'code', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.FAVOR_RECORD_REP, 'FavorRecordResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'code', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.DELETE_RECORD_REQ, 'DeleteRecordRequest', [
    { name: 'type', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'deleteAll', number: 2, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'deleteCodes', number: 3, kind: FieldType.STRING, repeated: true, wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.DELETE_RECORD_REP, 'DeleteRecordResponse', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'type', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'deleteAll', number: 3, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'deleteCodes', number: 4, kind: FieldType.STRING, repeated: true, wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.QUERY_FRIEND_INFO_REQ, 'QueryFriendInfoReq', []);

define(MESSAGE_ID.QUERY_FRIEND_INFO_RSP, 'QueryFriendInfoRsp', [
    { name: 'self', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'FriendInfo', wire: WireType.LENDELIM },
  ]);

define(0, 'PingPong', []);

define(MESSAGE_ID.PULL_ACT_ACCEPT_REQ, 'PullActAcceptReq', [
    { name: 'code', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.PULL_ACT_ACCEPT_REP, 'PullActAcceptRep', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'code', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'inviterUid', number: 4, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'inviterName', number: 5, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'inviterUFID', number: 6, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
  ]);

define(0, 'PullActTaskSimple', [
    { name: 'taskId', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'taskValue', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'completeCount', number: 3, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.PULL_ACT_REWARD_REQ, 'PullActRewardReq', [
    { name: 'taskId', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.PULL_ACT_REWARD_REP, 'PullActRewardRep', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'taskId', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'change', number: 5, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
    { name: 'taskInfo', number: 6, kind: FieldType.MESSAGE, repeated: true, typeName: 'PullActTaskSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.PULL_ACT_INFO_REQ, 'PullActInfoReq', []);

define(MESSAGE_ID.PULL_ACT_INFO_REP, 'PullActInfoRep', [
    { name: 'inviterInfo', number: 1, kind: FieldType.MESSAGE, repeated: false, typeName: 'PullActInviterInfo', wire: WireType.LENDELIM },
    { name: 'accepterInfo', number: 2, kind: FieldType.MESSAGE, repeated: false, typeName: 'PullActAccepterInfo', wire: WireType.LENDELIM },
  ]);

define(0, 'PullActInviterInfo', [
    { name: 'inviteCode', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'accepterList', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'AccepterSimple', wire: WireType.LENDELIM },
    { name: 'taskInfo', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'PullActTaskSimple', wire: WireType.LENDELIM },
  ]);

define(0, 'AccepterSimple', [
    { name: 'nickname', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'level', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(0, 'PullActAccepterInfo', [
    { name: 'inviteCode', number: 1, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'nickname', number: 2, kind: FieldType.STRING, repeated: false, wire: WireType.LENDELIM },
    { name: 'taskInfo', number: 3, kind: FieldType.MESSAGE, repeated: true, typeName: 'PullActTaskSimple', wire: WireType.LENDELIM },
  ]);

define(MESSAGE_ID.DLC4_GETINFO_REQ, 'DLC4GetInfoReq', []);

define(MESSAGE_ID.DLC4_GETINFO_REP, 'DLC4GetInfoRep', [
    { name: 'stageInfos', number: 1, kind: FieldType.MESSAGE, repeated: true, typeName: 'DLC4StageSimple', wire: WireType.LENDELIM },
    { name: 'characterInfos', number: 2, kind: FieldType.MESSAGE, repeated: true, typeName: 'DLC4CharacterSimple', wire: WireType.LENDELIM },
    { name: 'equipments', number: 3, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'DLC4StageSimple', [
    { name: 'sid', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'starInfo', number: 2, kind: FieldType.BOOL, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'DLC4CharacterSimple', [
    { name: 'cid', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'talentInfo', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'equipInfo', number: 3, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(0, 'DLC4BattleResultInfo', [
    { name: 'isFristReward', number: 1, kind: FieldType.BOOL, repeated: false, wire: WireType.VARINT },
    { name: 'starInfo', number: 2, kind: FieldType.BOOL, repeated: true, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.DLC4_SETTALENT_REQ, 'DLC4SetTalentReq', [
    { name: 'cid', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'talentInfo', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.DLC4_SETTALENT_REP, 'DLC4SetTalentRep', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'cid', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'talentInfo', number: 3, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.DLC4_SETEQUIPMENT_REQ, 'DLC4SetEquipmentReq', [
    { name: 'cid', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'equipInfo', number: 2, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.DLC4_SETEQUIPMENT_REP, 'DLC4SetEquipmentRep', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'cid', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'equipInfo', number: 3, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.DLC4_FORGING_REQ, 'DLC4ForgingReq', [
    { name: 'eid', number: 1, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
  ]);

define(MESSAGE_ID.DLC4_FORGING_REP, 'DLC4ForgingRep', [
    { name: 'error', number: 1, kind: FieldType.ENUM, repeated: false, typeName: 'ErrorCode', wire: WireType.VARINT },
    { name: 'eid', number: 2, kind: FieldType.INT32, repeated: false, wire: WireType.VARINT },
    { name: 'equipments', number: 3, kind: FieldType.INT32, repeated: true, wire: WireType.VARINT },
    { name: 'costInfo', number: 4, kind: FieldType.MESSAGE, repeated: false, typeName: 'PrizeInfoSimple', wire: WireType.LENDELIM },
  ]);
