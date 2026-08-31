// 由  mc-local-share gen 自动生成，请勿手改。

import { ActionType, ActivityStatus, AttackType, BattleLogSide, BattleLogType, ChatType, ContentType, CostType, EArenaState, EFriendBehaviorOp, EFriendState, EInfiStageType, EInfiState, ETaskState, ErrorCode, FriendSceneState, InfiScoreState, LocationStatus, RoomType, StepType } from './enums';

export interface BattleTarget {
  side: number;
  uid: number;
}

export interface Battlefield {
  side?: number;
  index?: number;
}

export interface CardRelated {
  uid?: number;
  cid?: number;
  cost?: number;
  isMaterialized?: boolean;
  locationStatus?: LocationStatus;
}

export interface Abilitie {
  skillId: number[];
  passiveSkillId: number[];
  skillExpander: SkillExpander[];
  atk?: number;
  curDef?: number;
  maxDef?: number;
  isPrepare?: boolean;
  flyLayer?: number;
  auraSkillId: number[];
}

export interface SkillExpander {
  skillID?: number;
  expander?: number;
}

export interface DeployActionSimple {
  'type': ActionType;
  index: number;
  cardUid: number;
  field?: Battlefield;
  target?: BattleTarget;
}

export interface Hit {
  field?: Battlefield;
  bufferId?: number;
  hurt?: number;
  card?: CardRelated;
  abilitie?: Abilitie;
  attacker?: Battlefield;
}

export interface HeroInfo {
  side?: number;
  heroID?: number;
  heroSkillID?: number;
  heroSkillCD?: number;
  curMana?: number;
  maxMana?: number;
  curHP?: number;
  maxHP?: number;
  atk?: number;
  handCount?: number;
  deckCount?: number;
  cemeteryCount?: number;
  tmpMana?: number;
}

export interface Talk {
  field?: Battlefield;
  talkIDs: number[];
}

export interface Action {
  b1?: Battlefield;
  b2?: Battlefield;
  skillId?: number;
  attackType?: AttackType;
  hits: Hit[];
  isPassive?: boolean;
  heros: HeroInfo[];
  talk?: Talk;
}

export interface BattleLogUnit {
  side?: number;
  field?: number;
  cid?: number;
  atk?: number;
  def?: number;
  maxDef?: number;
  isMaterialized?: boolean;
  activeSkills: number[];
  passiveSkills: number[];
}

export interface BattleLogParams {
  units: BattleLogUnit[];
  intParams: number[];
}

export interface BattleLogSimple {
  'type'?: BattleLogType;
  side?: BattleLogSide;
  battleParams: BattleLogParams[];
}

export interface IdPair {
  id: number;
  count: number;
}

export interface KickOut {
  error: ErrorCode;
}

export interface CommonError {
  error: ErrorCode;
  bandMid?: number;
}

export interface ClickStatistic {
  clickCount: number[];
  bannerCount: IdPair[];
  boardClick: IdPair[];
}

export interface TimeStampSimple {
  time?: number;
  zone?: number;
}

export interface HeartbeatReq {
  click?: ClickStatistic;
}

export interface HeartbeatRep {
  timestamp?: TimeStampSimple;
  moduleFlags: boolean[];
}

export interface RegisterRequest {
  username?: string;
  password?: string;
  version?: string;
  phoneType?: string;
  playerType?: number;
  deviceID?: string;
}

export interface RegisterResponse {
  error: ErrorCode;
  username?: string;
  password?: string;
}

export interface LoginRequest {
  username?: string;
  password?: string;
  version?: string;
}

export interface LoginResponse {
  error: ErrorCode;
  index?: string;
  token?: string;
  host?: string;
  port?: number;
}

export interface LoginBySDKRequest {
  userID?: string;
  token?: string;
  version?: string;
  phoneType?: string;
  deviceID?: string;
  activationCode?: string;
  timestamp?: string;
  playerType?: number;
}

export interface LoginBySDKResponse {
  error: ErrorCode;
  index?: string;
  token?: string;
  host?: string;
  port?: number;
}

export interface Logout {
  uid?: string;
  token?: string;
}

export interface AnnouncementRequest {
}

export interface AnnouncementResponse {
  title?: string;
  content?: string;
  cardmd5?: string;
  pvemd5?: string;
}

export interface GuiderInfo {
  value?: string;
}

export interface EnterGameRequest {
  version?: string;
  phoneType?: string;
  deviceID?: string;
  osversion?: string;
  network?: number;
  cpuScore?: number;
  uid?: string;
  token?: string;
  channelID?: string;
  idfaImei?: string;
  phoneOS?: number;
  cmgeSDKid?: string;
  language?: number;
}

export interface EnterGameResponse {
  error: ErrorCode;
  index?: string;
  playerInfo?: PlayerInfoSimple;
  cardLibrary?: CardLibrarySimple;
  deckLibrary?: DeckLibrarySimple;
  heroLibrary?: HeroLibrarySimple;
  itemInfo?: ItemInfoSimple;
  equipmentInfo?: EquipmentInfoSimple;
  buffInfo?: ItemBuffInfo;
  pveInfo?: PVEInfoSimple;
  ladderSeason?: LadderSeasonSimple;
  setting?: SettingSimple;
  activity: ActivitySimple[];
  guiderInfo?: GuiderInfo;
  battleRoomType?: RoomType;
  battleAccountToken?: string;
  battleRoomToken?: string;
  battleResult?: number;
  signInInfo?: DailySignInInfo;
  questionnaire?: boolean;
  achieveInfo: AchieveData[];
  timestamp?: TimeStampSimple;
  heroEquips: HeroEquipSimple[];
  loginActivity: LoginActivitySimple[];
  shopInfo: ShopSimpleInfo[];
  headPic?: number;
  headPicEx?: number;
  payInfo?: PayInfo;
  champInfo?: ChampSimpleInfo;
  firstCharge?: number;
  personalInfo?: PersonalSimpleInfo;
  expressionInfo?: ExpressionInfo;
  userTitleInfo?: UserTitleInfo;
  playerExtraInfo?: PlayerExtraInfoSimple;
  skinInfo?: SkinInfo;
  gildingInfo?: GildingInfo;
}

export interface MatchLadderRoomRequest {
  did?: number;
  'type'?: number;
}

export interface MatchLadderRoomResponse {
  error: ErrorCode;
}

export interface EditDeckRequest {
  deck?: DeckSimple;
}

export interface EditDeckResponse {
  error: ErrorCode;
  deck?: DeckSimple;
}

export interface DeleteDeckRequest {
  did?: number;
}

export interface DeleteDeckResponse {
  error: ErrorCode;
  did?: number;
}

export interface EditDeckEquipRequest {
  deckID?: number;
  equips: number[];
}

export interface EditDeckEquipResponse {
  error: ErrorCode;
  deckID?: number;
}

export interface BattleMatchStatus {
  status: number;
  'type': RoomType;
}

export interface LogicReconnectionRequest {
  version?: string;
  ip?: string;
}

export interface LogicReconnectionResponse {
  error: ErrorCode;
  index?: string;
  needFlush?: boolean;
  playerInfo?: PlayerInfoSimple;
  cardLibrary?: CardLibrarySimple;
  deckLibrary?: DeckLibrarySimple;
  heroLibrary?: HeroLibrarySimple;
  itemInfo?: ItemInfoSimple;
  equipmentInfo?: EquipmentInfoSimple;
  buffInfo?: ItemBuffInfo;
  pveInfo?: PVEInfoSimple;
  battleRoomType?: RoomType;
  battleAccountToken?: string;
  battleRoomToken?: string;
  battleResult?: number;
  timestamp?: TimeStampSimple;
  heroEquips: HeroEquipSimple[];
  loginActivity: LoginActivitySimple[];
  shopInfo: ShopSimpleInfo[];
  payInfo?: PayInfo;
  champInfo?: ChampSimpleInfo;
  firstCharge?: number;
  personalInfo?: PersonalSimpleInfo;
  expressionInfo?: ExpressionInfo;
  userTitleInfo?: UserTitleInfo;
  playerExtraInfo?: PlayerExtraInfoSimple;
  data: AchieveData[];
  skinInfo?: SkinInfo;
  gildingInfo?: GildingInfo;
  matchStatus?: BattleMatchStatus;
}

export interface CreatePVERoomRequest {
  did?: number;
  cid?: number;
  sid?: number;
}

export interface CreatePVERoomResponse {
  error: ErrorCode;
}

export interface CancelMatchRequest {
  roomType?: number;
}

export interface CancelMatchResponse {
  error: ErrorCode;
  battleRoomType?: RoomType;
  battleAccountToken?: string;
  battleRoomToken?: string;
}

export interface SeasonRewardRequest {
}

export interface SeasonRewardResponse {
  error: ErrorCode;
  curSID?: number;
  preSID?: number;
  ladderLevel?: number;
  prizeInfo?: PrizeInfoSimple;
}

export interface GetGiftInfoRequest {
}

export interface GetGiftInfoResponse {
  error: ErrorCode;
  gifts: GiftInfoSimple[];
  delGifts: GiftInfoSimple[];
}

export interface ReceiveGiftRequest {
  mid?: number;
}

export interface ReceiveGiftResponse {
  error: ErrorCode;
  mid?: number;
  prize?: PrizeInfoSimple;
  delGifts: GiftInfoSimple[];
}

export interface ChapterRewardRequest {
  cid?: number;
}

export interface ChapterRewardResponse {
  error: ErrorCode;
  cid?: number;
  prize?: PrizeInfoSimple;
}

export interface SectionRewardRequest {
  sectionID?: number;
}

export interface SectionRewardResponse {
  error: ErrorCode;
  sectionID?: number;
  prize?: PrizeInfoSimple;
}

export interface EditSettingRequest {
  setting?: SettingSimple;
}

export interface EditSettingResponse {
  error: ErrorCode;
  setting?: SettingSimple;
}

export interface ExchangeGiftCodeRequest {
  giftCode?: string;
}

export interface ExchangeGiftCodeResponse {
  error: ErrorCode;
}

export interface PushPVEComplete {
  chapter?: number;
  stage?: number;
  prize?: PrizeInfoSimple;
  hero?: HeroSimple;
  buffInfo?: ItemBuffInfo;
  isWin?: boolean;
  dlc4?: DLC4BattleResultInfo;
}

export interface PushLevelup {
  levelup: LevelupSimple[];
}

export interface PushLadderComplete {
  ladderSeason?: LadderSeasonSimple;
  dailyWin?: PrizeInfoSimple;
  upReward?: PrizeInfoSimple;
  hero?: HeroSimple;
  deck?: DeckSimple;
}

export interface BattleReadyRequest {
  version?: string;
}

export interface BattleStartResponse {
  roomType?: RoomType;
  token?: string;
  roomToken?: string;
  waitingTime?: number;
  enemyQuickBattle?: boolean;
  roundNum?: number;
  side?: number;
  battlers: BattlerSimple[];
  actions: Action[];
  infos: BattlerInfoSimple[];
  enemyID?: number;
}

export interface ChangeCardRequest {
  cardUids: number[];
  quickBattle?: boolean;
}

export interface ChangeCardResponse {
  changedCards: CardSimple_2[];
  quickBattle?: boolean;
  actions: Action[];
  selectedCards: number[];
  logs: BattleLogSimple[];
}

export interface DeploymentStartResponse {
  waitingTime?: number;
  battlers: BattlerSimple[];
  logs: BattleLogSimple[];
  penaltyTimes?: number;
  dealCached: number[];
}

export interface DeploymentCompleteRequest {
  action: DeployActionSimple[];
  penalty?: boolean;
}

export interface FightStartResponse {
  roundNum?: number;
  battlers: BattlerSimple[];
  logs: BattleLogSimple[];
}

export interface BattleEmojiRequest {
  id?: number;
}

export interface BattleEmojiResponse {
  side?: number;
  id?: number;
}

export interface SetAutoDeployRequest {
  autoDeploy?: boolean;
}

export interface SetAutoDeployResponse {
  error: ErrorCode;
  autoDeploy?: boolean;
}

export interface BattleReconnectionRequest {
  version?: string;
  accountToken?: string;
  ip?: string;
}

export interface BattleReconnectionResponse {
  error: ErrorCode;
  token?: string;
  roomToken?: string;
  roomType?: RoomType;
  quickBattle?: boolean;
  roundNum?: number;
  step?: StepType;
  needFlush?: boolean;
  side?: number;
  selfWin?: boolean;
  enemyWin?: boolean;
  battlers: BattlerSimple[];
  infos: BattlerInfoSimple[];
  selectedCards: number[];
  waitingTime?: number;
  enemyID?: number;
  logs: BattleLogSimple[];
  autoDeploy?: boolean;
  deployAction: DeployActionSimple[];
  penaltyTimes?: number;
  dealCached: number[];
}

export interface PushBattleWaiting {
  token?: string;
  roomToken?: string;
  roomType?: RoomType;
  overtime?: number;
}

export interface BattleCommonError {
  error: ErrorCode;
}

export interface PlayerInfoSimple {
  name?: string;
  money?: number;
  level?: number;
  exp?: number;
  diamond?: number;
  ash?: number;
  gender?: number;
  createTime?: number;
  jade?: number;
  curTitle?: string;
  curBackGround?: number;
  lastChangeNameTime?: number;
}

export interface PlayerExtraInfoSimple {
  headPic?: number;
  headPicEx?: number;
  curtitleA?: number;
  curtitleB?: number;
  curbackGround?: number;
  expressionSimple?: ExpressionSimpleInfo;
  buy_shopids: number[];
  cur_shortcut?: number;
}

export interface MoneySimple {
  gold?: number;
  sliver?: number;
  diamond?: number;
  ash?: number;
  jade?: number;
}

export interface LevelInfoSimple {
  level?: number;
  exp?: number;
}

export interface CardLibrarySimple {
  cards: CardSimple[];
  cardBacks: number[];
}

export interface CardSimple {
  cid?: number;
  count?: number;
}

export interface DeckLibrarySimple {
  decks: DeckSimple[];
  cardBack?: number;
}

export interface DeckSimple {
  did?: number;
  name?: string;
  hero?: number;
  job?: number;
  skill?: number;
  cards: number[];
  equipSlot1?: number;
  equipSlot2?: number;
  equipSlot3?: number;
  equipSlot4?: number;
  cardBack?: number;
  wins?: number;
  shared?: boolean;
}

export interface HeroSimple {
  hero?: number;
  unlockState?: number;
  favor?: number;
  favorLv?: number;
  curSkin?: number;
  kanBanSkin?: number;
}

export interface HeroDailyFavor {
  hero?: number;
  totalFavor?: number;
  battleFavor?: number;
}

export interface HeroFavorRewardInfo {
  rewardId: number[];
}

export interface HeroLibrarySimple {
  heros: HeroSimple[];
  dailyFavors: HeroDailyFavor[];
  rewardInfo?: HeroFavorRewardInfo;
}

export interface ItemInfoSimple {
  items: ItemSimple[];
}

export interface ItemSimple {
  iid?: number;
  count?: number;
  updateTime?: number;
}

export interface EquipmentInfoSimple {
  equipments: EquipmentSimple[];
}

export interface EquipmentSimple {
  sid?: number;
  eid?: number;
  updateTime?: number;
}

export interface BufferInfoSimple {
  buffers: BufferSimple[];
}

export interface BufferSimple {
  bid?: number;
  endTime?: number;
}

export interface PVEInfoSimple {
  chapters: ChapterSimple[];
  stages: StageSimple[];
  rewardedSections: number[];
  buyInfo?: PVEBuyInfoSimple;
}

export interface ChapterSimple {
  cid?: number;
  isPassed?: boolean;
  hasReward?: boolean;
}

export interface StageSimple {
  sid?: number;
  isPassed?: boolean;
}

export interface PVEBuyInfoSimple {
  buyChapters: number[];
  buySections: number[];
  buyStageGroup: number[];
  dlc4?: boolean;
}

export interface PrizeInfoSimple {
  prize: PrizeSimple[];
  money?: MoneySimple;
  levelInfo?: LevelInfoSimple;
  cards: CardSimple[];
  items: ItemSimple[];
  equips: EquipmentSimple[];
  hero?: HeroSimple;
  cardBacks: number[];
  personalInfo?: PersonalSimpleInfo;
  expressionInfo?: ExpressionInfo;
  userTitleInfo?: UserTitleInfo;
  skinInfo?: SkinInfo;
}

export interface PrizeSimple {
  itemId?: number;
  count?: number;
}

export interface LevelupSimple {
  level?: number;
  prizeInfo?: PrizeInfoSimple;
}

export interface LadderSeasonSimple {
  sid?: number;
  ladderLevel?: number;
  ladderStar?: number;
  meritPoint?: number;
  dailyWinCount?: number;
  historyBestLevel?: number;
  curBestLevel?: number;
}

export interface GiftInfoSimple {
  mid?: number;
  title?: string;
  content?: string;
  attachList: PrizeSimple[];
  expireTime?: number;
  tmpId?: number;
}

export interface SettingSimple {
  backgroundMusic?: number;
  soundEffect?: number;
  kanban?: number;
  disableBGM?: boolean;
  disableSE?: boolean;
  quickBattle?: boolean;
  ignoreQBRequest?: boolean;
}

export interface BattleFieldSimple {
  index?: number;
  hasCard?: boolean;
  card?: CardSimple_2;
  orgIndex?: number;
}

export interface CardSimple_2 {
  uid?: number;
  cid?: number;
  cost?: number;
  isMaterialized?: boolean;
  abilitie?: Abilitie;
}

export interface BattlerSimple {
  heroInfo?: HeroInfo;
  hand: CardSimple_2[];
  battleFields: BattleFieldSimple[];
  deckIDs: number[];
  cemeteryIDs: number[];
  equipIDs: number[];
}

export interface BattlerInfoSimple {
  side?: number;
  name?: string;
  hero?: number;
  job?: number;
  cardBack?: number;
  ladderLv?: number;
  ladderStar?: number;
  meritPoint?: number;
  playerTitle: number[];
  skin?: number;
  gildingUse: GildingSimple[];
}

export interface TaskSimple {
  taskID?: number;
  value?: number;
  state?: ETaskState;
  group?: number;
}

export interface TaskRewardRequest {
  taskID?: number;
}

export interface TaskRewardResponse {
  error: ErrorCode;
  taskID: number[];
  prizeInfo?: PrizeInfoSimple;
  point?: number;
  newTasks: TaskSimple[];
}

export interface TaskDataRequest {
}

export interface TaskDataResponse {
  list: TaskSimple[];
  taskPoint?: TaskPointSimple;
}

export interface TaskPointSimple {
  point?: number;
  record: number[];
}

export interface TaskPointRewardRequest {
  id?: number;
}

export interface TaskPointRewardResponse {
  error: ErrorCode;
  id?: number;
  prizeInfo?: PrizeInfoSimple;
}

export interface ActivitySimple {
  actID?: number;
  value?: number;
  completeCount?: number;
}

export interface LoginActivitySimple {
  id: number;
  rewardIds: number[];
  flag: boolean;
  waitForRewards: number[];
  loginDays?: number;
}

export interface GuiderUpdateInfo {
  guideID?: string;
  'type'?: number;
  state?: number;
}

export interface GuiderUpdateRequest {
  infoList: GuiderUpdateInfo[];
}

export interface GuiderUpdateResponse {
}

export interface ChangeDeckNameRequest {
  did?: number;
  name?: string;
}

export interface ChangeDeckNameResponse {
  error: ErrorCode;
  did?: number;
  name?: string;
}

export interface ChangeDefaultCardBackRequest {
  cardBack?: number;
}

export interface ChangeDefaultCardBackResponse {
  error: ErrorCode;
  cardBack?: number;
}

export interface ChangeDeckCardBackRequest {
  dids: number[];
  cardBack?: number;
}

export interface ChangeDeckCardBackResponse {
  error: ErrorCode;
  dids: number[];
  cardBack?: number;
}

export interface CardResolveRequest {
  cards: CardSimple[];
}

export interface CardResolveResponse {
  error: ErrorCode;
  request: CardSimple[];
  success: CardSimple[];
  getInfo?: PrizeInfoSimple;
  costInfo?: PrizeInfoSimple;
  deckInfo?: DeckLibrarySimple;
}

export interface CardCompoundRequest {
  cards: CardSimple[];
}

export interface CardCompoundResponse {
  error: ErrorCode;
  request: CardSimple[];
  success: CardSimple[];
  getInfo?: PrizeInfoSimple;
  costInfo?: PrizeInfoSimple;
}

export interface ItemBuffInfo {
  buffs: ItemBuffSimple[];
}

export interface ItemBuffSimple {
  id?: number;
  leftCount?: number;
}

export interface CookRequest {
  recipeId?: number;
}

export interface CookResponse {
  error: ErrorCode;
  recipeId?: number;
  buffInfo?: ItemBuffInfo;
  costInfo?: PrizeInfoSimple;
}

export interface CookClearRequest {
}

export interface CookClearResponse {
  error: ErrorCode;
  buffInfo?: ItemBuffInfo;
}

export interface UseItemRequest {
  item?: ItemSimple;
}

export interface UseItemResponse {
  error: ErrorCode;
  getInfo?: PrizeInfoSimple;
  costInfo?: PrizeInfoSimple;
  buffInfo?: ItemBuffInfo;
}

export interface SetPlayerNameRequest {
  name?: string;
  gender?: number;
}

export interface SetPlayerNameResponse {
  error: ErrorCode;
  name?: string;
  gender?: number;
  headPic?: number;
  personalInfo?: PersonalSimpleInfo;
}

export interface ChangePlayerNameRequest {
  name: string;
}

export interface ChangePlayerNameResponse {
  error: ErrorCode;
  name: string;
  change?: PrizeInfoSimple;
  lastChangeNameTime?: number;
}

export interface DealStepResponse {
  roundNum?: number;
  actions: Action[];
  logs: BattleLogSimple[];
}

export interface FightStepResponse {
  roundNum?: number;
  actions: Action[];
  logs: BattleLogSimple[];
}

export interface BattleEndResponse {
  winInfo?: number;
  roundNum?: number;
  quit?: number;
}

export interface SetGuiderRequest {
  value?: string;
}

export interface SetGuiderResponse {
  error: ErrorCode;
  value?: string;
}

export interface GiveMeFiveRequest {
  cmd?: string;
  info?: string;
}

export interface GiveMeFiveResponse {
  result?: boolean;
  prizeInfo?: PrizeInfoSimple;
  playerInfo?: PlayerInfoSimple;
  pveInfo?: PVEInfoSimple;
  ladderSeason?: LadderSeasonSimple;
  signInInfo?: DailySignInInfo;
  battlers: BattlerSimple[];
  heroInfo?: HeroLibrarySimple;
  battlePass?: BattlePassResponse;
  equipmentInfo?: EquipmentInfoSimple;
  buffInfo?: ItemBuffInfo;
  cmd?: string;
  'get'?: PrizeInfoSimple;
  cost?: PrizeInfoSimple;
}

export interface ArenaBattleCountInfo {
  winCount?: number;
  loseCount?: number;
  battleCount?: number;
}

export interface ArenaHeroDeckInfo {
  combineId: number;
  cards: number[];
}

export interface ArenaCardSelectGroup {
  defineId: number;
  maxGroupIdx: number;
  cards: number[];
}

export interface ArenaEnterRequest {
}

export interface ArenaEnterResponse {
  error: ErrorCode;
  state?: EArenaState;
  selectCombines: number[];
  countInfo?: ArenaBattleCountInfo;
  deckInfo?: ArenaHeroDeckInfo;
  groupInfo?: ArenaCardSelectGroup;
}

export interface ArenaBuyTicketRequest {
  costPack: CostPack;
}

export interface ArenaBuyTicketResponse {
  error: ErrorCode;
  state?: EArenaState;
  change?: PrizeInfoSimple;
  selectCombines: number[];
}

export interface ArenaSelectHeroRequest {
  id?: number;
}

export interface ArenaSelectHeroResponse {
  error: ErrorCode;
  state?: EArenaState;
  id?: number;
  groupInfo?: ArenaCardSelectGroup;
  deckInfo?: ArenaHeroDeckInfo;
}

export interface ArenaSelectCardsRequest {
  defineId: number;
  selectIdxs: number[];
}

export interface ArenaSelectCardsResponse {
  error: ErrorCode;
  state?: EArenaState;
  defineId?: number;
  groupInfo?: ArenaCardSelectGroup;
  deckInfo?: ArenaHeroDeckInfo;
}

export interface ArenaGetRewardRequest {
}

export interface ArenaGetRewardResponse {
  error: ErrorCode;
  state?: EArenaState;
  getInfo?: PrizeInfoSimple;
}

export interface ArenaBattleRequest {
}

export interface ArenaBattleResponse {
  error: ErrorCode;
}

export interface ArenaBattleComplete {
  state?: EArenaState;
  countInfo?: ArenaBattleCountInfo;
}

export interface ArenaGiveUpRequest {
}

export interface ArenaGiveUpResponse {
  error: ErrorCode;
  state?: EArenaState;
}

export interface InfiAssets {
  id?: number;
  count?: number;
}

export interface InfiSingleStage {
  floor?: number;
  index?: number;
  'type'?: EInfiStageType;
  nextStages: number[];
  pathId?: number;
  isRandomType?: boolean;
}

export interface InfiStageInfo {
  totalFloor?: number;
  curStage?: InfiSingleStage;
  canEnter?: boolean;
  stages: InfiSingleStage[];
  inBattle?: boolean;
}

export interface InfiHeroInfo {
  hero?: number;
  job?: number;
  level?: number;
  exp?: number;
  curHP?: number;
  maxHP?: number;
  deckGroupId?: number;
}

export interface InfiTreasure {
  uniqueID?: number;
  treasureID?: number;
  leftCount?: number;
}

export interface InfiItemInfo {
  silver?: number;
  spellEquips: InfiTreasure[];
  souls: InfiTreasure[];
  badSouls: InfiTreasure[];
}

export interface InfiEventOpt {
  index?: number;
  eventOptID?: number;
  param1?: number;
  param2?: number;
  valid?: boolean;
  success?: boolean;
}

export interface InfiEventInfo {
  eventID?: number;
  opts: InfiEventOpt[];
}

export interface InfiShopCard {
  id?: number;
  baseCost?: number;
  realCost?: number;
}

export interface InfiShopInfo {
  cards: InfiShopCard[];
  upCardCount?: number;
  freeUpCount?: number;
}

export interface InfiShopItem {
  slot?: number;
  id?: number;
  sold?: boolean;
}

export interface InfiOpenShopInfo {
  items: InfiShopItem[];
  buyCount?: number;
  refreshCount?: number;
}

export interface InfiInnInfo {
  delCardCount?: number;
  freeDelCount?: number;
  canRecover?: boolean;
}

export interface InfiBoxInfo {
  rewards: number[];
}

export interface InfiGlobalData {
  upCardCount?: number;
  delCardCount?: number;
  freeUpCount?: number;
  freeDelCount?: number;
}

export interface InfiScoreDetail {
  scoreId?: number;
  count?: number;
  score?: number;
}

export interface InfiScoreInfo {
  totalScore?: number;
  details: InfiScoreDetail[];
}

export interface InfiStaticData {
  unlockDifficulty?: number;
  unlockMessages: number[];
  passDifficulty: number;
  unlockEvents: number[];
  appearMainStoryEvents: number[];
  unlockDeckGroups: number[];
}

export interface OptionParam {
  param1?: number;
  param2?: number;
}

export interface InfiEnterRequest {
  resetFlag?: boolean;
}

export interface InfiEnterResponse {
  error: ErrorCode;
  round?: number;
  state?: EInfiState;
  selectJobs: number[];
  selectHeros: number[];
  cards: number[];
  stageInfo?: InfiStageInfo;
  heroInfo?: InfiHeroInfo;
  itemInfo?: InfiItemInfo;
  globalData?: InfiGlobalData;
  shopInfo?: InfiOpenShopInfo;
  passDifficulty: number;
  selectDifficulty?: number;
  selectedDeckGroups: number[];
}

export interface InfiSelectJobRequest {
  job?: number;
}

export interface InfiSelectJobResponse {
  error: ErrorCode;
  state?: EInfiState;
  job?: number;
  selectHeros: number[];
}

export interface InfiSelectHeroRequest {
  hero?: number;
}

export interface InfiSelectHeroResponse {
  error: ErrorCode;
  state?: EInfiState;
  hero?: number;
  heroInfo?: InfiHeroInfo;
  selectedDeckGroups: number[];
}

export interface InfiSelectDeckRequest {
  deckGroupId: number;
}

export interface InfiSelectDeckResponse {
  error: ErrorCode;
  state?: EInfiState;
  deckGroupId?: number;
  itemInfo?: InfiItemInfo;
  stageInfo?: InfiStageInfo;
  heroInfo?: InfiHeroInfo;
  globalData?: InfiGlobalData;
  cards: number[];
  shopInfo?: InfiOpenShopInfo;
}

export interface InfiSelectEventRequest {
  index?: number;
  optList: OptionParam[];
  giveup?: boolean;
}

export interface InfiSelectEventResponse {
  error: ErrorCode;
  state?: EInfiState;
  index?: number;
  optList: OptionParam[];
  itemInfo?: InfiItemInfo;
  heroInfo?: InfiHeroInfo;
  cards: number[];
  costInfo?: PrizeInfoSimple;
  'get': InfiAssets[];
  cost: InfiAssets[];
}

export interface InfiSelectStageRequest {
  index?: number;
}

export interface InfiSelectStageResponse {
  error: ErrorCode;
  state?: EInfiState;
  index?: number;
  stageInfo?: InfiStageInfo;
  eventInfo?: InfiEventInfo;
  shopInfo?: InfiShopInfo;
  innInfo?: InfiInnInfo;
  boxInfo?: InfiBoxInfo;
  globalData?: InfiGlobalData;
  enemyId?: number;
}

export interface InfiUpCardRequest {
  cardID?: number;
}

export interface InfiUpCardResponse {
  error: ErrorCode;
  state?: EInfiState;
  cardID?: number;
  cards: number[];
  itemInfo?: InfiItemInfo;
  shopUpCount?: number;
  globalData?: InfiGlobalData;
  costInfo?: PrizeInfoSimple;
  'get': InfiAssets[];
  cost: InfiAssets[];
}

export interface InfiDelCardRequest {
  cardID?: number;
}

export interface InfiDelCardResponse {
  error: ErrorCode;
  state?: EInfiState;
  cardID?: number;
  cards: number[];
  itemInfo?: InfiItemInfo;
  innDelCount?: number;
  globalData?: InfiGlobalData;
  costInfo?: PrizeInfoSimple;
  'get': InfiAssets[];
  cost: InfiAssets[];
}

export interface InfiBuyItemRequest {
  'type'?: number;
  itemID?: number;
  param?: number;
  slot?: number;
}

export interface InfiBuyItemResponse {
  error: ErrorCode;
  state?: EInfiState;
  itemID?: number;
  param?: number;
  slot?: number;
  cards: number[];
  itemInfo?: InfiItemInfo;
  globalData?: InfiGlobalData;
  costInfo?: PrizeInfoSimple;
  'get': InfiAssets[];
  cost: InfiAssets[];
}

export interface BattleReward {
  silver?: number;
  cards: number[];
  items: number[];
}

export interface InfiBattleSource {
  stageType?: EInfiStageType;
  enemyID?: number;
  param?: number;
}

export interface InfiBattleComplete {
  state?: EInfiState;
  isWin?: boolean;
  source?: InfiBattleSource;
  heroInfo?: InfiHeroInfo;
  reward?: BattleReward;
}

export interface InfiSelectRewardRequest {
  'type'?: number;
  option?: OptionParam;
}

export interface InfiSelectRewardResponse {
  error: ErrorCode;
  state?: EInfiState;
  'type'?: number;
  cards: number[];
  itemInfo?: InfiItemInfo;
  heroInfo?: InfiHeroInfo;
  globalData?: InfiGlobalData;
  costInfo?: PrizeInfoSimple;
  getInfo?: PrizeInfoSimple;
  'get': InfiAssets[];
  cost: InfiAssets[];
}

export interface InfiRecoverRequest {
}

export interface InfiRecoverResponse {
  error: ErrorCode;
  heroInfo?: InfiHeroInfo;
}

export interface InfiExitStageRequest {
}

export interface InfiExitStageResponse {
  error: ErrorCode;
  state?: EInfiState;
}

export interface InfiGetBoxRequest {
  slotIndex?: number;
}

export interface InfiGetBoxResponse {
  error: ErrorCode;
  state?: EInfiState;
  itemInfo?: InfiItemInfo;
  'get': InfiAssets[];
  cost: InfiAssets[];
}

export interface InfiAssetsChange {
  'get': InfiAssets[];
  cost: InfiAssets[];
}

export interface InfiReplaceTreasureRequest {
  srcID?: number;
  dstID?: number;
}

export interface InfiReplaceTreasureResponse {
  error: ErrorCode;
  itemInfo?: InfiItemInfo;
}

export interface InfiDelSpellEquipRequest {
  slotIndex?: number;
}

export interface InfiDelSpellEquipResponse {
  error: ErrorCode;
  slotIndex?: number;
}

export interface InfiStateChangePush {
  curHP?: number;
  maxHP?: number;
  silver?: number;
}

export interface InfiRoundEndPush {
  curRound?: number;
  isPassed?: boolean;
  scoreInfo?: InfiScoreInfo;
  historyState?: InfiScoreState;
  'get'?: PrizeInfoSimple;
  difficulty?: number;
}

export interface InfiUnlockDifficultyReq {
  id?: number;
  costPack?: CostPack;
}

export interface InfiUnlockDifficultyRep {
  error: ErrorCode;
  id?: number;
  change?: PrizeInfoSimple;
}

export interface InfiBuyMessageReq {
  id?: number;
  costPack?: CostPack;
}

export interface InfiBuyMessageRep {
  error: ErrorCode;
  id?: number;
  change?: PrizeInfoSimple;
}

export interface InfiUnlockEventReq {
  eventId: number;
  costPack: CostPack;
}

export interface InfiUnlockEventRep {
  error: ErrorCode;
  eventId?: number;
  change?: PrizeInfoSimple;
}

export interface InfiSelectDifficultyReq {
  id?: number;
}

export interface InfiSelectDifficultyRep {
  error: ErrorCode;
  state?: EInfiState;
  selectId?: number;
  heroInfo?: InfiHeroInfo;
  itemInfo?: InfiItemInfo;
  stageInfo?: InfiStageInfo;
  cards: number[];
  shopInfo?: InfiOpenShopInfo;
}

export interface InfiGetStaticDataReq {
}

export interface InfiGetStaticDataRep {
  data?: InfiStaticData;
}

export interface InfiRefreshOpenShopReq {
  costPack: CostPack;
}

export interface InfiRefreshOpenShopRep {
  error: ErrorCode;
  shop?: InfiOpenShopInfo;
  change?: PrizeInfoSimple;
}

export interface InfiOpenShopBuyRequest {
  slot?: number;
}

export interface InfiOpenShopBuyResponse {
  error: ErrorCode;
  slot?: number;
  'get': InfiAssets[];
  cost?: PrizeInfoSimple;
}

export interface InfiOpenShopExitRequest {
}

export interface InfiOpenShopExitResponse {
  error: ErrorCode;
  state?: EInfiState;
  stageInfo?: InfiStageInfo;
  cards: number[];
  itemInfo?: InfiItemInfo;
}

export interface InfiUnlockData {
  unlockJobs: number[];
  unlockCards: number[];
  unlockEvents: number[];
  unlockTreasures: number[];
  unlockDifficulty: number;
  unlockDeckGroups: number[];
}

export interface InfiGetSimpleDataRequest {
}

export interface InfiGetSimpleDataResponse {
  unlockData?: InfiUnlockData;
}

export interface DailySignInInfo {
  nextSignInId?: number;
  lastSignInTime?: number;
  signInCount?: number;
  canSign?: boolean;
}

export interface DailySignInRequest {
  id?: number;
}

export interface DailySignInResponse {
  error: ErrorCode;
  info?: DailySignInInfo;
  reward?: PrizeInfoSimple;
}

export interface GetSignInInfoRequest {
}

export interface GetSignInInfoResponse {
  info?: DailySignInInfo;
}

export interface ActivityEventData {
  actID?: number;
  eventID?: number;
  value?: number;
  completeCount?: number;
}

export interface ActivityInfo {
  actID?: number;
  status?: ActivityStatus;
  openTime?: number;
  extendTime?: number;
  closeTime?: number;
  resetTime?: number;
  point?: number;
  totalPoint?: number;
}

export interface ActivityTradeInfo {
  id: number;
  rewardCount: number;
}

export interface GetActitiviesRequest {
}

export interface GetActitiviesResponse {
  activities: ActivityInfo[];
  data: ActivityEventData[];
  trade: ActivityTradeInfo[];
}

export interface GetActivityRewardRequest {
  actID?: number;
  eventID?: number;
  costPack?: CostPack;
  otherIDs: number[];
}

export interface GetActivityRewardResponse {
  error: ErrorCode;
  actID?: number;
  eventID?: number;
  data?: ActivityEventData;
  'get'?: PrizeInfoSimple;
  cost?: PrizeInfoSimple;
  point?: number;
  totalPoint?: number;
  change?: PrizeInfoSimple;
  otherDatas: ActivityEventData[];
}

export interface GetActivityTradeRewardRequest {
  id: number;
}

export interface GetActivityTradeRewardResponse {
  error: ErrorCode;
  info?: ActivityTradeInfo;
  'get'?: PrizeInfoSimple;
  cost?: PrizeInfoSimple;
}

export interface ActivityEventDataPush {
  data: ActivityEventData[];
}

export interface GetLoginActivityDataRep {
  data: LoginActivitySimple[];
}

export interface GetLoginActivityRewardReq {
  groupId: number;
}

export interface GetLoginActivityRewardRep {
  error: ErrorCode;
  groupId: number;
  rewardIds: number[];
  data: LoginActivitySimple[];
  'get'?: PrizeInfoSimple;
}

export interface ShopSimpleInfo {
  id?: number;
  buyCount?: number;
  totalBuyCount?: number;
  'type'?: number;
  floorCounts: FloorCount[];
}

export interface FloorCount {
  rarity: number;
  count: number;
}

export interface PersonalSimpleInfo {
  headPic_list: number[];
  headPicEx_list: number[];
}

export interface ShortcutInfo {
  index?: number;
  id?: number;
}

export interface ExpressionSimpleInfo {
  shortcut_1: ShortcutInfo[];
  shortcut_2: ShortcutInfo[];
  shortcut_3: ShortcutInfo[];
}

export interface ExpressionInfo {
  expressionList: number[];
}

export interface UserTitleInfo {
  userTitleList: number[];
  backGroundList: number[];
}

export interface skinData {
  id?: number;
  overdueTimes?: number;
}

export interface SkinInfo {
  skinList: skinData[];
}

export interface GetShopInfoRequest {
  'type'?: number;
}

export interface GetShopInfoResponse {
  'type'?: number;
  info: ShopSimpleInfo[];
}

export interface ShopBuyRequest {
  'type'?: number;
  buyID?: number;
  buyCount?: number;
  couponBuyCount?: number;
  costPack: CostPack;
}

export interface ShopBuyResponse {
  error: ErrorCode;
  'type'?: number;
  buyID?: number;
  buyCount?: number;
  items: ItemInfoSimple[];
  change?: PrizeInfoSimple;
  shopInfo: ShopSimpleInfo[];
}

export interface QuestionnaireData {
  id?: number;
  choice: number[];
  content?: string;
}

export interface GetQuestionnaireRequest {
}

export interface GetQuestionnaireResponse {
  data: QuestionnaireData[];
}

export interface UpdateQuestionnaireRequest {
  isCommit?: boolean;
  data: QuestionnaireData[];
}

export interface AnnounceLamp {
  id?: number;
  content?: string;
  circleTimes?: number;
  priority?: number;
  paras: string[];
  twcontent?: string;
  isGmSend?: number;
  endTime?: number;
}

export interface AnnounceLampCancel {
  id?: number;
}

export interface AchieveData {
  id?: number;
  value?: number;
  reward?: boolean;
}

export interface GetAchieveInfoRequest {
}

export interface GetAchieveInfoResponse {
  data: AchieveData[];
  point?: number;
}

export interface GetAchieveRewardRequest {
  idList: number[];
}

export interface GetAchieveRewardResponse {
  error: ErrorCode;
  reqIds: number[];
  success: number[];
  'get'?: PrizeInfoSimple;
  point?: number;
  addAchi: AchieveData[];
}

export interface StorySkip {
  storyID?: number;
}

export interface RankCommonDisplayData {
  rank: number;
  uid: string;
  name: string;
  score: number;
  userTitle: string;
  background: number;
  headPic: number;
  headPicEx: number;
}

export interface LadderRankSimple {
  common: RankCommonDisplayData;
  ladderLv: number;
  ladderExp: number;
  ladderPoint: number;
}

export interface InfiRankSimple {
  common: RankCommonDisplayData;
  isWin: boolean;
  difficulty: number;
}

export interface ChampRankSimple {
  common: RankCommonDisplayData;
  win: number;
  lose: number;
}

export interface GetRankRequest {
  rankType: number;
  begin: number;
  end: number;
}

export interface GetRankResponse {
  error: ErrorCode;
  rankType?: number;
  beginIdx?: number;
  endIdx?: number;
  selfRank?: number;
  selfScore?: number;
  ladder: LadderRankSimple[];
  infi: InfiRankSimple[];
  selfInfi?: InfiRankSimple;
  champ: ChampRankSimple[];
}

export interface GetRankDetailRequest {
  rankType: number;
  uid: string;
}

export interface GetRankDetailResponse {
  error: ErrorCode;
  rankType: number;
  uid: string;
  ladder?: LadderRankDetail;
  infi?: InfiRankDetail;
  champ?: ChampRankDetail;
}

export interface LadderRankDetail {
  common: RankCommonDisplayData;
  hero: number;
  job: number;
  cards: number[];
  ladderLv: number;
  ladderExp: number;
  ladderPoint: number;
  skin: number;
}

export interface InfiRankDetail {
  common: RankCommonDisplayData;
  hero: number;
  job: number;
  cards: number[];
  spellEquips: number[];
  souls: number[];
  badSouls: number[];
  isWin?: boolean;
  floor?: number;
  enemyName?: string;
  difficulty?: number;
  scoreExtra?: number;
  scoreInfo?: InfiScoreInfo;
  skin: number;
}

export interface ChampRankDetail {
  common: RankCommonDisplayData;
  win?: number;
  lose?: number;
}

export interface GetRPGInfoResponse {
  error: ErrorCode;
  characters: RPGCharacterSimple[];
  equipments: RPGEquipmentSimple[];
  chapters: number[];
  stages: number[];
  expedition: number[];
}

export interface RPGCharacterSimple {
  cid?: number;
  level?: number;
  exp?: number;
  equipSlot1?: number;
  equipSlot2?: number;
  equipSlot3?: number;
  equipSlot4?: number;
  equipSlot5?: number;
  equipSlot6?: number;
  usable?: boolean;
}

export interface RPGEquipmentSimple {
  sid?: number;
  eid?: number;
  equipped?: boolean;
}

export interface EditCharacterRequest {
  character?: RPGCharacterSimple;
}

export interface EditCharacterResponse {
  error: ErrorCode;
  character?: RPGCharacterSimple;
  equipments: RPGEquipmentSimple[];
}

export interface EditExpeditionRequest {
  expedition: number[];
}

export interface EditExpeditionResponse {
  error: ErrorCode;
  expedition: number[];
}

export interface PlayStoryRequest {
  chapter?: number;
  stage?: number;
  characters: number[];
}

export interface PlayStoryResponse {
  error: ErrorCode;
  token?: string;
  roomToken?: string;
  stageType?: number;
}

export interface PVESkipRequest {
  cid?: number;
  sid?: number;
  hero?: number;
  job?: number;
}

export interface PVESkipResponse {
  error: ErrorCode;
}

export interface PushRPGInfo {
  characters: RPGCharacterSimple[];
  equipments: RPGEquipmentSimple[];
  chapters: number[];
  stages: number[];
}

export interface ChallengeHeroRequest {
  hero?: number;
  deckId?: number;
}

export interface ChallengeHeroResponse {
  error: ErrorCode;
  hero?: number;
  token?: string;
  roomToken?: string;
}

export interface ChallengeHeroComplete {
  heroSimple?: HeroSimple;
  buffInfo?: ItemBuffInfo;
}

export interface PushHeroSimpleInfo {
  heroSimple: HeroSimple[];
  dailyFavors: HeroDailyFavor[];
}

export interface HeroGiveGiftRequest {
  hero?: number;
  itemId?: number;
  count?: number;
}

export interface HeroGiveGiftResponse {
  error: ErrorCode;
  heroSimple?: HeroSimple;
  dailyFavor?: HeroDailyFavor;
  cost?: PrizeInfoSimple;
}

export interface GetFavorRewardRequest {
  hero?: number;
  favorRewardId?: number;
}

export interface GetFavorRewardResponse {
  error: ErrorCode;
  hero?: number;
  favorRewardId?: number;
  reward?: PrizeInfoSimple;
  rewardInfo?: HeroFavorRewardInfo;
}

export interface SetHeroSkinRequest {
  hero?: number;
  skin?: number;
}

export interface SetHeroSkinResponse {
  error: ErrorCode;
  hero?: number;
  skin?: number;
}

export interface TipsNotice {
  tp?: number;
  val?: number;
  val2?: number;
  val3?: number;
}

export interface BattlePassInfo {
  bpState?: boolean;
  level?: number;
  exp?: number;
  bpPayExp?: boolean;
}

export interface BattlePassQuest {
  id?: number;
  count?: number;
  val?: number;
}

export interface BattlePassRequest {
}

export interface BattlePassResponse {
  info?: BattlePassInfo;
  freeRewardFlag: number[];
  rewardFlag: number[];
  quest: BattlePassQuest[];
}

export interface BattlePassRewardRequest {
  lv?: number;
  free?: boolean;
}

export interface BattlePassRewardResponse {
  freeRewardFlag: number[];
  rewardFlag: number[];
  reward?: PrizeInfoSimple;
  error: ErrorCode;
}

export interface BattlePassBuyExpRequest {
  lv?: number;
  costPack?: CostPack;
}

export interface BattlePassBuyExpResponse {
  level?: number;
  exp?: number;
  error: ErrorCode;
  diamondCost?: number;
  change?: PrizeInfoSimple;
}

export interface BattlePassActiveRequest {
}

export interface BattlePassActiveResponse {
  error: ErrorCode;
  info?: BattlePassInfo;
}

export interface BattleRecordUnit {
  msgid?: number;
  msgInfo?: Uint8Array;
}

export interface BattleRecord {
  battleInfo: BattleRecordUnit[];
}

export interface FriendInfo {
  uid?: string;
  ufid?: string;
  name?: string;
  headPic?: string;
  createTime?: number;
  level?: number;
  gender?: number;
  guildName?: string;
  ladderRank?: number;
  staticCardCount?: number;
  staticLadderHistory?: number;
  staticRankHistory?: number;
  staticInfiHistory?: number;
  offlineTime?: number;
  state?: EFriendState;
  cur_headPic?: number;
  cur_headPicEx?: number;
  cur_UserTitle?: string;
  cur_BackGround?: number;
  language?: number;
}

export interface InviteFriendInfo {
  createTime?: number;
  info?: FriendInfo;
}

export interface FriendInfoRpt {
}

export interface FriendInfoNtf {
  self?: FriendInfo;
  invite: InviteFriendInfo[];
  other: FriendInfo[];
  search_list: FriendInfo[];
  last_refresh_time: number;
}

export interface FriendBehaviorRpt {
  tp?: EFriendBehaviorOp;
  ufid?: string;
  did?: number;
  fast?: number;
}

export interface FriendBehaviorNtf {
  tp?: EFriendBehaviorOp;
  ufid?: string;
  info?: FriendInfo;
  over_fightwait_time?: number;
}

export interface FriendStateNtf {
  uid?: string;
  state?: EFriendState;
  offlineTime?: number;
}

export interface FriendOpStatusNtf {
  error: ErrorCode;
  battleAccountToken?: string;
  battleRoomToken?: string;
}

export interface FriendRefreshRearchNtf {
  info: FriendInfo[];
  refresh_time: number;
}

export interface FriendRefreshScenceRpt {
  scene: FriendSceneState;
}

export interface GetInfiStoryRequest {
}

export interface GetInfiStoryResponse {
  storyEvents: number[];
}

export interface HeroEquipSimple {
  hero?: number;
  equips: number[];
}

export interface ModifyEquipRequest {
  hero?: number;
  equips: number[];
  equipType?: number;
}

export interface ModifyEquipResponse {
  error: ErrorCode;
  heroEquip?: HeroEquipSimple;
  equipType?: number;
}

export interface ModifyDeckCardsRequest {
  deckId?: number;
  deckName?: string;
  job?: number;
  hero?: number;
  modifyCards?: boolean;
  cards: number[];
}

export interface ModifyDeckCardsResponse {
  error: ErrorCode;
  deck?: DeckSimple;
}

export interface ChatContent {
  'from'?: string;
  to?: string;
  content?: string;
  tp?: ChatType;
  createTime?: number;
  'type'?: ContentType;
  info?: RecordBaseInfo;
}

export interface ChatInfoRpt {
  tp?: number;
}

export interface ChatInfoNtf {
  content: ChatContent[];
}

export interface TransChatInfoRpt {
  content?: ChatContent;
}

export interface TransChatInfoNtf {
  content?: ChatContent;
}

export interface SetHeadPicReq {
  id: number;
}

export interface SetHeadPicRsp {
  error: ErrorCode;
  id: number;
}

export interface SetHeadPicExReq {
  id: number;
}

export interface SetHeadPicExRsp {
  error: ErrorCode;
  id: number;
}

export interface SetHeadFaceRpt {
  id: number;
  url?: string;
}

export interface ClientLuaResponse {
  lua: string;
}

export interface GetDeckCodeReq {
  deck?: DeckSimple;
}

export interface GetDeckCodeRep {
  error: ErrorCode;
  code?: string;
}

export interface GetDeckDataReq {
  code?: string;
}

export interface GetDeckDataRep {
  error: ErrorCode;
  deck?: DeckSimple;
}

export interface SharedDeckInfoSimple {
  id?: number;
  uid?: string;
  name?: string;
  headPic?: number;
  headPicEx?: number;
  tag?: number;
  uploadTime?: number;
  usageCount?: number;
  code?: string;
  hero?: number;
  job?: number;
}

export interface GetSharedDecksReq {
}

export interface GetSharedDecksRep {
  error: ErrorCode;
  infos: SharedDeckInfoSimple[];
}

export interface ShareDeckReq {
  did?: number;
  tag?: number;
}

export interface ShareDeckRep {
  error: ErrorCode;
  deck?: DeckSimple;
}

export interface UseSharedDeckNt {
  id?: number;
}

export interface PushPrizeInfo {
  'get'?: PrizeInfoSimple;
  cost?: PrizeInfoSimple;
}

export interface PushNoticeRsp {
  info?: string;
}

export interface QueryPersonalInfoReq {
}

export interface QueryPersonalInfoRsp {
  info?: PersonalSimpleInfo;
}

export interface QueryExpressionInfoReq {
}

export interface QueryExpressionInfoRsp {
  info?: ExpressionInfo;
}

export interface SetExpressionShortcutReq {
  index: number;
  location: number;
  id: number;
}

export interface SetExpressionShortcutRsp {
  error: ErrorCode;
  index: number;
  shortcuts: ShortcutInfo[];
}

export interface UnloadExpressionShortcutReq {
  index: number;
  location: number;
}

export interface UnloadExpressionShortcutRsp {
  error: ErrorCode;
  index: number;
  shortcuts: ShortcutInfo[];
}

export interface ClearExpressionShortcutReq {
  index: number;
}

export interface ClearExpressionShortcutRsp {
  error: ErrorCode;
  index: number;
}

export interface SetDefaultShortcutReq {
  index: number;
}

export interface SetDefaultShortcutRsp {
  error: ErrorCode;
  index: number;
}

export interface QueryUserTitelInfoReq {
}

export interface QueryUserTitelInfoRsp {
  info?: UserTitleInfo;
}

export interface SetUserTitleReq {
  titleA?: number;
  titleB?: number;
  backGround?: number;
}

export interface SetUserTitleRsp {
  error: ErrorCode;
  title: string;
  backGround?: number;
  titleA?: number;
  titleB?: number;
}

export interface PayInfo {
  payProducts: number[];
}

export interface PayResponse {
  error: ErrorCode;
  productId: number;
  'get'?: PrizeInfoSimple;
  info?: PayInfo;
}

export interface FirstChargePush {
  firstCharge?: number;
}

export interface FirstChargeRewardReq {
}

export interface FirstChargeRewardRep {
  error: ErrorCode;
  'get'?: PrizeInfoSimple;
  firstCharge?: number;
}

export interface PveBuyPush {
  error: ErrorCode;
  productId: number;
  buyInfo?: PVEBuyInfoSimple;
  change?: PrizeInfoSimple;
}

export interface CostPack {
  'type': CostType;
  cost1: number;
  cost2?: number;
  transferCount?: number;
}

export interface PveBuyRequest {
  buyType: number;
  buyId: number;
  costPack: CostPack;
}

export interface PveBuyResponse {
  error: ErrorCode;
  buyType: number;
  buyId: number;
  change?: PrizeInfoSimple;
  buyInfo?: PVEBuyInfoSimple;
}

export interface DailyMatchupSimple {
  id?: number;
  rewardTimes?: number;
  passedStage: number[];
}

export interface DailyPveSimple {
  matchup?: DailyMatchupSimple;
}

export interface GetDailyPveInfoRequest {
}

export interface GetDailyPveInfoResponse {
  error: ErrorCode;
  simple?: DailyPveSimple;
}

export interface QueryExpressionShortcutReq {
}

export interface QueryExpressionShortcutRsp {
  shortcuts: ShortcutInfo[];
}

export interface ActivityPveSimple {
  chapters: number[];
  passedStages: number[];
}

export interface GetActivityPveInfoReq {
  activity_id: number;
}

export interface GetActivityPveInfoRsp {
  error: ErrorCode;
  pve_info?: ActivityPveSimple;
  activity_id: number;
}

export interface ChampSimpleInfo {
  id: number;
  state: number;
  exitTimes: number;
  battleInfo: ChampBattleInfo;
}

export interface ChampBattleInfo {
  winCount: number;
  loseCount: number;
  historyWin: number;
  curRank: number;
  totalWin: number;
  historyLose: number;
}

export interface ChampRewardInfo {
  winRewards: number[];
  winExtraRewards: number[];
  rankReward: boolean;
}

export interface ChampDeckInfo {
  limitDeckId?: number;
  deckLibrary?: DeckLibrarySimple;
}

export interface ChampInfo {
  id: number;
  state: number;
  exitTimes: number;
  battleInfo: ChampBattleInfo;
  rewardInfo: ChampRewardInfo;
  deckInfo: ChampDeckInfo;
}

export interface ChampGetInfoRequest {
}

export interface ChampGetInfoResponse {
  info: ChampInfo;
}

export interface ChampBuyTicketRequest {
  costPack?: CostPack;
}

export interface ChampBuyTicketResponse {
  error: ErrorCode;
  info?: ChampInfo;
  change?: PrizeInfoSimple;
}

export interface ChampEditDeckRequest {
  deck: DeckSimple;
}

export interface ChampEditDeckResponse {
  error: ErrorCode;
  deck?: DeckSimple;
}

export interface ChampDelDeckRequest {
  did: number;
}

export interface ChampDelDeckResponse {
  error: ErrorCode;
  did: number;
}

export interface ChampBattleRequest {
  did: number;
}

export interface ChampBattleResponse {
  error: ErrorCode;
}

export interface ChampGetWinRewardRequest {
  id: number;
}

export interface ChampGetWinRewardResponse {
  error: ErrorCode;
  id: number;
  rewardInfo?: ChampRewardInfo;
  change?: PrizeInfoSimple;
}

export interface ChampGetRankRewardRequest {
}

export interface ChampGetRankRewardResponse {
  error: ErrorCode;
  change?: PrizeInfoSimple;
}

export interface ChampBattleComplete {
  id: number;
  state: number;
  battleInfo: ChampBattleInfo;
}

export interface SetHeadInfoReq {
  headPic?: number;
  headPicEx?: number;
}

export interface SetHeadInfoRsp {
  error: ErrorCode;
  headPic?: number;
  headPicEx?: number;
}

export interface SteamDLCCheckReq {
}

export interface SteamDLCCheckRsp {
  error: ErrorCode;
}

export interface QueryFailChargeOrderIDReq {
}

export interface QueryFailChargeOrderIDRsp {
  error: ErrorCode;
  OrderID: string;
  status: number;
}

export interface QuerySkinInfoReq {
}

export interface QuerySkinInfoRsp {
  info?: SkinInfo;
}

export interface UseSkinReq {
  heroID?: number;
  skinID?: number;
  isKanBan?: boolean;
}

export interface UseSkinRsp {
  error: ErrorCode;
  heroID?: number;
  skinID?: number;
  isKanBan?: boolean;
}

export interface GildingSimple {
  gildingId: number;
  cardGroups: number[];
}

export interface GildingInfo {
  gildingList: GildingSimple[];
  useList: GildingSimple[];
}

export interface GildingRequest {
  gildingId: number;
  cards: number[];
  costPack?: CostPack;
}

export interface GildingResponse {
  error: ErrorCode;
  gildingId?: number;
  change?: PrizeInfoSimple;
  simple?: GildingSimple;
  simpleUse: GildingSimple[];
  cards: number[];
}

export interface GildingResetRequest {
  cards: number[];
}

export interface GildingResetResponse {
  error: ErrorCode;
  cards: number[];
  useList: GildingSimple[];
}

export interface CardMakeTimeData {
  Open: number;
  End: number;
  CompoundItem: number;
  CompoundItemNumber: number;
  ResolveGetItem: number;
  ResolveGetItemNumber: number;
}

export interface CardMakeData {
  cardID: number;
  datas: CardMakeTimeData[];
}

export interface BattlePassRateData {
  ID: number;
  Rate: number;
  Open: number;
  End: number;
}

export interface RecordBaseInfo {
  code?: string;
  roomType?: RoomType;
  roundCount?: number;
  battleTime?: number;
  battlers: RecordBattlerInfo[];
}

export interface RecordBattlerInfo {
  uid?: string;
  name?: string;
  side?: number;
  hero?: number;
  job?: number;
  win?: boolean;
}

export interface GetRecordListRequest {
}

export interface GetRecordListResponse {
  error: ErrorCode;
  recentRecords: RecordBaseInfo[];
  favorRecords: RecordBaseInfo[];
}

export interface GetRecordInfoRequest {
  code?: string;
}

export interface GetRecordInfoResponse {
  error: ErrorCode;
  code?: string;
  info?: RecordBaseInfo;
}

export interface GetRecordDataRequest {
  code?: string;
  side?: number;
}

export interface GetRecordDataResponse {
  error: ErrorCode;
  record?: BattleRecord;
}

export interface FavorRecordRequest {
  code?: string;
}

export interface FavorRecordResponse {
  error: ErrorCode;
  code?: string;
}

export interface DeleteRecordRequest {
  'type'?: number;
  deleteAll?: boolean;
  deleteCodes: string[];
}

export interface DeleteRecordResponse {
  error: ErrorCode;
  'type'?: number;
  deleteAll?: boolean;
  deleteCodes: string[];
}

export interface QueryFriendInfoReq {
}

export interface QueryFriendInfoRsp {
  self?: FriendInfo;
}

export interface PingPong {
}

export interface PullActAcceptReq {
  code: string;
}

export interface PullActAcceptRep {
  error: ErrorCode;
  code: string;
  inviterUid: string;
  inviterName: string;
  inviterUFID: string;
}

export interface PullActTaskSimple {
  taskId: number;
  taskValue: number;
  completeCount: number;
}

export interface PullActRewardReq {
  taskId: number;
}

export interface PullActRewardRep {
  error: ErrorCode;
  taskId: number;
  change?: PrizeInfoSimple;
  taskInfo: PullActTaskSimple[];
}

export interface PullActInfoReq {
}

export interface PullActInfoRep {
  inviterInfo: PullActInviterInfo;
  accepterInfo: PullActAccepterInfo;
}

export interface PullActInviterInfo {
  inviteCode: string;
  accepterList: AccepterSimple[];
  taskInfo: PullActTaskSimple[];
}

export interface AccepterSimple {
  nickname: string;
  level: number;
}

export interface PullActAccepterInfo {
  inviteCode: string;
  nickname: string;
  taskInfo: PullActTaskSimple[];
}

export interface DLC4GetInfoReq {
}

export interface DLC4GetInfoRep {
  stageInfos: DLC4StageSimple[];
  characterInfos: DLC4CharacterSimple[];
  equipments: number[];
}

export interface DLC4StageSimple {
  sid?: number;
  starInfo: boolean[];
}

export interface DLC4CharacterSimple {
  cid?: number;
  talentInfo: number[];
  equipInfo: number[];
}

export interface DLC4BattleResultInfo {
  isFristReward?: boolean;
  starInfo: boolean[];
}

export interface DLC4SetTalentReq {
  cid?: number;
  talentInfo: number[];
}

export interface DLC4SetTalentRep {
  error: ErrorCode;
  cid?: number;
  talentInfo: number[];
}

export interface DLC4SetEquipmentReq {
  cid?: number;
  equipInfo: number[];
}

export interface DLC4SetEquipmentRep {
  error: ErrorCode;
  cid?: number;
  equipInfo: number[];
}

export interface DLC4ForgingReq {
  eid?: number;
}

export interface DLC4ForgingRep {
  error: ErrorCode;
  eid?: number;
  equipments: number[];
  costInfo?: PrizeInfoSimple;
}
