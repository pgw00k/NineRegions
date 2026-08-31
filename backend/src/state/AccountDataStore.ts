/**
 * AccountDataStore.ts — 玩家账号数据（业务模拟层核心）。
 *
 * 解决「账号里没有任何 Card / Hero」的问题：EnterGameResponse 的
 * cardLibrary / deckLibrary / heroLibrary / shopInfo 由本模块产出，
 * 牌组/英雄/商店等业务消息（EditDeck/DeleteDeck/ShopBuy/...）读写同一份档案，
 * 保证客户端所见即服务端所存（牌组增删改、分解合成、好感度等状态保持）。
 *
 * 设计要点：
 *  - **确定性生成**：同一 userID 每次登录生成同一份档案（hash 做种子），
 *    避免重启服务后数据漂移；修改操作落在档案上，会话内持续生效。
 *  - **数据源**：src/data/game/*.json 由 tools/extract_account_data.py 从客户端
 *    lua 表提取（TableCard_Cards / Heroes / Decks / HeroeUniqueSkills），
 *    卡/英雄 ID 均来自真实配置（hero 1-10 免费初始、hero i → 专属技能 10000i）。
 *  - **序列化**：所有 payload 输出「字段号 keyed」对象，直接喂 ProtobufEncoder，
 *    与 mocks/ 的 JSON 约定一致（见 MockLoader 文档）。
 *  - 扩展性：新增业务只需在 Archive 上加字段 + 在对应 Handler 里调用 API。
 */
import * as fs from 'fs';
import * as path from 'path';
import { PROJECT_ROOT } from '../config/env';

// ---------------------------------------------------------------------------
// 类型
// ---------------------------------------------------------------------------

/** 服务端保存的英雄状态（对应 HeroSimple: #1 hero #2 unlockState #3 favor #4 favorLv #5 curSkin）。 */
export interface HeroState {
  hero: number;
  /** LockType: 0=Lock 1=Challenge 2=Unlocked（客户端 JYTableEnum.Card.LockType 实证） */
  unlockState: number;
  favor: number;
  favorLv: number;
  curSkin: number;
}

/** 服务端保存的牌组（对应 DeckSimple 各字段）。 */
export interface DeckState {
  did: number;
  name: string;
  hero: number;
  job: number;
  skill: number;
  cards: number[]; // 卡 ID 列表（可重复）
  equipSlot1: number;
  equipSlot2: number;
  equipSlot3: number;
  equipSlot4: number;
  cardBack: number;
  wins: number;
  shared: boolean;
}

/** 商店条目购买记录（对应 ShopSimpleInfo）。 */
export interface ShopState {
  id: number;
  buyCount: number;
  totalBuyCount: number;
  type: number;
}

/** 账号档案：一次登录会话内可变的全部业务状态。 */
export interface AccountArchive {
  userId: string;
  cards: Map<number, number>; // cid -> count（卡牌库）
  cardBacks: number[]; // 已拥有的卡背 ID
  defaultCardBack: number;
  heroes: Map<number, HeroState>;
  decks: Map<number, DeckState>;
  shop: Map<number, ShopState>; // 商店已购记录（key = id*10+type 便于区分）
  money: { gold: number; sliver: number; diamond: number; ash: number; jade: number };
  nextDid: number; // 新建牌组 ID 分配
}

/** 从客户端数据表提取的静态配置（加载自 src/data/game/）。 */
interface GameData {
  cards: Map<number, { formal: number; element: number; rarity: number }>;
  heros: Map<number, { jobs: number[]; isFree: number; lockType: number }>;
  heroSkills: Map<number, number>;
  decks: Map<number, { hero: number; skill: number; cards: number[]; class: number }>;
}

// ---------------------------------------------------------------------------
// 静态配置加载（懒加载 + 单例）
// ---------------------------------------------------------------------------

const GAME_DATA_DIR = path.resolve(PROJECT_ROOT, 'src', 'data', 'game');

let gameDataCache: GameData | null = null;

function loadGameData(): GameData {
  if (gameDataCache) return gameDataCache;
  const read = (name: string): Record<string, unknown> =>
    JSON.parse(fs.readFileSync(path.join(GAME_DATA_DIR, name), 'utf-8'));
  const cards = new Map<number, { formal: number; element: number; rarity: number }>();
  for (const [k, v] of Object.entries(read('cards.json') as Record<string, { formal: number; element: number; rarity: number }>)) {
    cards.set(Number(k), v);
  }
  const heros = new Map<number, { jobs: number[]; isFree: number; lockType: number }>();
  for (const [k, v] of Object.entries(read('heros.json') as Record<string, { jobs: number[]; isFree: number; lockType: number }>)) {
    heros.set(Number(k), v);
  }
  const heroSkills = new Map<number, number>();
  for (const [k, v] of Object.entries(read('heroSkills.json') as Record<string, number>)) {
    heroSkills.set(Number(k), Number(v));
  }
  const decks = new Map<number, { hero: number; skill: number; cards: number[]; class: number }>();
  for (const [k, v] of Object.entries(read('decks.json') as Record<string, { hero: number; skill: number; cards: number[]; class: number }>)) {
    decks.set(Number(k), v);
  }
  gameDataCache = { cards, heros, heroSkills, decks };
  return gameDataCache;
}

// ---------------------------------------------------------------------------
// 确定性伪随机（mulberry32：轻量、可复现、零依赖）
// ---------------------------------------------------------------------------

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// 账号档案
// ---------------------------------------------------------------------------

/** 初始解锁英雄（hero 1-10 免费初始，取前 3 个即可支撑英雄/牌组界面）。 */
const INITIAL_HEROES = [1, 2, 3];
/** 新牌组默认名（客户端 StringUtil "初始角色默认卡组名" 实证语义）。 */
const DEFAULT_DECK_NAME = '默认卡组';
/** 生成牌组的卡数（九野牌组 30-39 张区间，预设牌组 1001 为 39 张）。 */
const GENERATED_DECK_SIZE = 30;
/** 预设牌组 hero=101（全职业中立卡池，见 decks.json）——作为 hero 1 的初始牌组模板。 */
const PRESET_DECK_ID = 1001;

export class AccountDataStore {
  private readonly archives = new Map<string, AccountArchive>();

  /** 取（或生成）某用户的账号档案。 */
  archive(userId: string): AccountArchive {
    let a = this.archives.get(userId);
    if (!a) {
      // a = this.generate(userId);
      a = this.test(userId);
      this.archives.set(userId, a);
    }
    return a;
  }

  private test(userId: string) {
    const data = loadGameData();
    const heroes = new Map<number, HeroState>([
      [1, { hero: 1, unlockState: 2, favor: 0, favorLv: 1, curSkin: 0 }],
      [2, { hero: 2, unlockState: 2, favor: 0, favorLv: 1, curSkin: 0 }],
      [3, { hero: 3, unlockState: 2, favor: 0, favorLv: 1, curSkin: 0 }],
    ]);

    let cards = new Map<number, number>([
      [10001, 3],
      [10002, 3],
      [10017, 3],
      [10018, 3],
      [10019, 3],
      [10020, 3],
      [10021, 3],
      [10022, 3],
      [10023, 3],
      [10025, 3],
      [10026, 3],
      [10028, 3],
      [10112, 3],
      [10113, 3],
      [10122, 3],
      [10024, 3],
    ]);

    let decks = new Map<number, DeckState>([
      // [1, this.makeDeck(1, DEFAULT_DECK_NAME, 1, 1, [])],
    ]);
    let did = 1;

    return {
      userId,
      cards,
      cardBacks: [1], // 默认卡背 kabei_01（carddeck/kabei_01.dat 实证）
      defaultCardBack: 1,
      heroes,
      decks,
      shop: new Map(),
      money: { gold: 5000, sliver: 0, diamond: 500, ash: 0, jade: 0 },
      nextDid: did,
    };
  }

  // -------------------------------------------------------------------------
  // 生成
  // -------------------------------------------------------------------------

  private generate(userId: string): AccountArchive {
    const data = loadGameData();
    const rng = mulberry32(hashSeed(userId));
    const deckTpl = data.decks.get(PRESET_DECK_ID);

    const heroes = new Map<number, HeroState>();
    for (const hid of INITIAL_HEROES) {
      heroes.set(hid, { hero: hid, unlockState: 2, favor: 0, favorLv: 1, curSkin: 0 });
    }

    const decks = new Map<number, DeckState>();
    const cards = new Map<number, number>();

    // 牌组 1：使用真实预设牌组 1001（中立卡池）作为模板，绑定 hero 1
    let did = 1;
    if (deckTpl && deckTpl.cards.length > 0) {
      const tpl = deckTpl.cards.filter((cid) => this.cardUsableForJob(data, cid, 1));
      const list = tpl.length >= GENERATED_DECK_SIZE ? tpl : this.fillDeck(data, tpl, 1, GENERATED_DECK_SIZE, rng);
      decks.set(did, this.makeDeck(did, DEFAULT_DECK_NAME, 1, 1, list));
      this.addCards(cards, list);
      did++;
    }
    // 牌组 2/3：按职业卡池确定性生成
    for (const hid of INITIAL_HEROES.slice(1)) {
      const job = (data.heros.get(hid)?.jobs ?? [hid])[0] || hid;
      const list = this.fillDeck(data, [], job, GENERATED_DECK_SIZE, rng);
      decks.set(did, this.makeDeck(did, DEFAULT_DECK_NAME, hid, job, list));
      this.addCards(cards, list);
      did++;
    }

    // 卡库补充：每个初始英雄职业的正式卡各来几张（丰富卡牌界面，count 由种子驱动）
    for (const hid of INITIAL_HEROES) {
      const job = (data.heros.get(hid)?.jobs ?? [hid])[0] || hid;
      for (const [cid, def] of data.cards) {
        if (cards.size >= 60) break;
        if (!def.formal) continue;
        if (def.element !== 0 && def.element !== job) continue;
        if (cards.has(cid)) continue;
        cards.set(cid, 1 + Math.floor(rng() * 3));
      }
    }

    return {
      userId,
      cards,
      cardBacks: [1], // 默认卡背 kabei_01（carddeck/kabei_01.dat 实证）
      defaultCardBack: 1,
      heroes,
      decks,
      shop: new Map(),
      money: { gold: 5000, sliver: 0, diamond: 500, ash: 0, jade: 0 },
      nextDid: did,
    };
  }

  private makeDeck(did: number, name: string, hero: number, job: number, cards: number[]): DeckState {
    return {
      did,
      name,
      hero,
      job,
      skill: loadGameData().heroSkills.get(hero) ?? 100000,
      cards,
      equipSlot1: 0,
      equipSlot2: 0,
      equipSlot3: 0,
      equipSlot4: 0,
      cardBack: 1,
      wins: 0,
      shared: false,
    };
  }

  /** 卡是否可用于某职业牌组（中立 或 同职业，与 DeckMgr 过滤逻辑一致）。 */
  private cardUsableForJob(data: GameData, cid: number, job: number): boolean {
    const def = data.cards.get(cid);
    if (!def || !def.formal) return false;
    return def.element === 0 || def.element === job;
  }

  /** 从职业卡池抽取 base 之外缺的卡，凑够 size 张（确定性种子）。 */
  private fillDeck(data: GameData, base: number[], job: number, size: number, rng: () => number): number[] {
    const pool: number[] = [];
    for (const [cid, def] of data.cards) {
      if (!def.formal) continue;
      if (def.element !== 0 && def.element !== job) continue;
      pool.push(cid);
    }
    const out = base.slice();
    // 洗牌（Fisher-Yates + rng）
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    for (const cid of pool) {
      if (out.length >= size) break;
      out.push(cid);
    }
    return out;
  }

  private addCards(cards: Map<number, number>, list: number[]): void {
    for (const cid of list) cards.set(cid, (cards.get(cid) ?? 0) + 1);
  }

  // -------------------------------------------------------------------------
  // 序列化（字段号 keyed，直接喂 ProtobufEncoder）
  // -------------------------------------------------------------------------

  /** EnterGameResponse #4 cardLibrary（CardLibrarySimple）。 */
  cardLibraryPayload(userId: string): Record<string, unknown> {
    const a = this.archive(userId);
    return {
      1: [...a.cards.entries()]
        .filter(([, count]) => count > 0)
        .map(([cid, count]) => ({ 1: cid, 2: count })),
      2: a.cardBacks,
    };
  }

  /** EnterGameResponse #5 deckLibrary（DeckLibrarySimple）。 */
  deckLibraryPayload(userId: string): Record<string, unknown> {
    const a = this.archive(userId);
    return {
      1: [...a.decks.values()].map((d) => this.deckSimplePayload(d)),
      2: a.defaultCardBack,
    };
  }

  /** 单条 DeckSimple payload。 */
  deckSimplePayload(d: DeckState): Record<string, unknown> {
    return {
      1: d.did,
      2: d.name,
      3: d.hero,
      4: d.job,
      5: d.skill,
      6: d.cards,
      7: d.equipSlot1,
      8: d.equipSlot2,
      9: d.equipSlot3,
      10: d.equipSlot4,
      11: d.cardBack,
      12: d.wins,
      13: d.shared,
    };
  }

  /** EnterGameResponse #6 heroLibrary（HeroLibrarySimple）。 */
  heroLibraryPayload(userId: string): Record<string, unknown> {
    const a = this.archive(userId);
    return {
      1: [...a.heroes.values()].map((h) => ({
        1: h.hero,
        2: h.unlockState,
        3: h.favor,
        4: h.favorLv,
        5: h.curSkin,
      })),
      2: [], // dailyFavors（英雄每日好感，暂无）
      3: {}, // rewardInfo（好感奖励领取记录，暂无）
    };
  }

  /** EnterGameResponse #25 shopInfo（ShopSimpleInfo[]）。 */
  shopInfoPayload(userId: string): Record<string, unknown>[] {
    const a = this.archive(userId);
    return [...a.shop.values()].map((s) => ({
      1: s.id,
      2: s.buyCount,
      3: s.totalBuyCount,
      4: s.type,
    }));
  }

  // -------------------------------------------------------------------------
  // 业务 API（供各 Handler 调用；返回值均为字段号 keyed payload 或 null）
  // -------------------------------------------------------------------------

  /** 10005 EditDeck：覆写牌组（did 不存在则新建）。返回覆写后的 DeckSimple payload。 */
  editDeck(userId: string, deck: Record<string, unknown>): Record<string, unknown> | null {
    const a = this.archive(userId);
    const did = num(deck['1']) ?? a.nextDid;
    const hero = num(deck['3']) ?? 1;
    const job = num(deck['4']) ?? hero;
    const state: DeckState = {
      did,
      name: str(deck['2']) ?? DEFAULT_DECK_NAME,
      hero,
      job,
      skill: num(deck['5']) ?? loadGameData().heroSkills.get(hero) ?? 100000,
      cards: ints(deck['6']) ?? [],
      equipSlot1: num(deck['7']) ?? 0,
      equipSlot2: num(deck['8']) ?? 0,
      equipSlot3: num(deck['9']) ?? 0,
      equipSlot4: num(deck['10']) ?? 0,
      cardBack: num(deck['11']) ?? a.defaultCardBack,
      wins: num(deck['12']) ?? 0,
      shared: !!deck['13'],
    };
    a.decks.set(did, state);
    if (did >= a.nextDid) a.nextDid = did + 1;
    return this.deckSimplePayload(state);
  }

  /** 10007 DeleteDeck：删除牌组。返回 did。 */
  deleteDeck(userId: string, did: number): number | null {
    const a = this.archive(userId);
    if (!a.decks.delete(did)) return null;
    return did;
  }

  /** 10039 ChangeDeckName：改名。返回 {did, name} 或 null。 */
  changeDeckName(userId: string, did: number, name: string): { did: number; name: string } | null {
    const a = this.archive(userId);
    const d = a.decks.get(did);
    if (!d) return null;
    d.name = name || DEFAULT_DECK_NAME;
    return { did, name: d.name };
  }

  /** 10041 CardResolve：分解卡（扣除数量，返回分解结果）。 */
  resolveCards(userId: string, cards: { cid: number; count: number }[]): {
    success: { cid: number; count: number }[];
    getInfo: Record<string, unknown>;
    deckInfo: Record<string, unknown>;
  } | null {
    const a = this.archive(userId);
    const success: { cid: number; count: number }[] = [];
    for (const { cid, count } of cards) {
      const have = a.cards.get(cid) ?? 0;
      const take = Math.min(count, have);
      if (take <= 0) continue;
      a.cards.set(cid, have - take);
      success.push({ cid, count: take });
      // 分解产出：灰烬（ash），每张 10（真实数值见 Cards.ResolveGetItem1，此处取演示值）
      a.money.ash += take * 10;
    }
    if (success.length === 0) return null;
    return {
      success,
      getInfo: { 4: { 1: a.money.ash } }, // PrizeInfoSimple.money.ash
      deckInfo: this.deckLibraryPayload(userId),
    };
  }

  /** 10043 CardCompound：合成卡（扣灰烬，加卡）。 */
  compoundCards(userId: string, cards: { cid: number; count: number }[]): {
    success: { cid: number; count: number }[];
    costInfo: Record<string, unknown>;
  } | null {
    const a = this.archive(userId);
    const success: { cid: number; count: number }[] = [];
    let cost = 0;
    for (const { cid, count } of cards) {
      const per = 50; // 合成单张费用（演示值）
      if (a.money.ash < per * count) break;
      a.money.ash -= per * count;
      a.cards.set(cid, (a.cards.get(cid) ?? 0) + count);
      cost += per * count;
      success.push({ cid, count });
    }
    if (success.length === 0) return null;
    return { success, costInfo: { 4: { 1: a.money.ash } } };
  }

  /** 10210 GetShopInfo：返回指定类型的已购记录 payload（无则空数组）。 */
  getShopInfo(userId: string, type: number): Record<string, unknown>[] {
    const a = this.archive(userId);
    return [...a.shop.values()]
      .filter((s) => s.type === type)
      .map((s) => ({ 1: s.id, 2: s.buyCount, 3: s.totalBuyCount, 4: s.type }));
  }

  /** 10212 ShopBuy：扣货币、记录购买。返回购买结果 payload。 */
  buy(userId: string, type: number, buyId: number, count: number): {
    items: Record<string, unknown>[];
    shopInfo: Record<string, unknown>[];
  } | null {
    const a = this.archive(userId);
    const key = buyId * 10 + type;
    let s = a.shop.get(key);
    if (!s) {
      s = { id: buyId, buyCount: 0, totalBuyCount: 0, type };
      a.shop.set(key, s);
    }
    s.buyCount += count;
    s.totalBuyCount += count;
    // 演示：每买 1 次扣 50 金币
    a.money.gold -= 50 * count;
    return {
      items: [], // ItemInfoSimple（商店货物配置在客户端表，服务端无需回货）
      shopInfo: this.getShopInfo(userId, type),
    };
  }

  /** 10262 HeroGiveGift：送礼加好感。返回更新后的 HeroSimple + dailyFavor payload。 */
  giveGift(userId: string, hero: number, count: number): { heroSimple: Record<string, unknown>; dailyFavor: Record<string, unknown> } | null {
    const a = this.archive(userId);
    const h = a.heroes.get(hero);
    if (!h) return null;
    h.favor += count * 5;
    // 好感等级：每 100 好感升 1 级（演示曲线）
    h.favorLv = 1 + Math.floor(h.favor / 100);
    return {
      heroSimple: { 1: h.hero, 2: h.unlockState, 3: h.favor, 4: h.favorLv, 5: h.curSkin },
      dailyFavor: { 1: hero, 2: h.favor, 3: count * 5 },
    };
  }

  /** 10264 GetFavorReward：领好感奖励。返回奖励 payload。 */
  getFavorReward(userId: string, hero: number, rewardId: number): Record<string, unknown> | null {
    const a = this.archive(userId);
    if (!a.heroes.has(hero)) return null;
    // 演示：奖励 100 金币 + 10 灰烬
    a.money.gold += 100;
    a.money.ash += 10;
    return { 4: { 1: a.money.gold, 4: a.money.ash } }; // PrizeInfoSimple.money
  }

  /** 10266 SetHeroSkin：换肤。返回 {hero, skin}。 */
  setHeroSkin(userId: string, hero: number, skin: number): { hero: number; skin: number } | null {
    const a = this.archive(userId);
    const h = a.heroes.get(hero);
    if (!h) return null;
    h.curSkin = skin;
    return { hero, skin };
  }

  /** 10260 ChallengeHero：挑战英雄 → 成功后解锁。返回 {hero, token, roomToken}。 */
  challengeHero(userId: string, hero: number): { hero: number; token: string; roomToken: string } | null {
    const a = this.archive(userId);
    const def = loadGameData().heros.get(hero);
    if (!def) return null;
    a.heroes.set(hero, { hero, unlockState: 2, favor: 0, favorLv: 1, curSkin: 0 });
    return { hero, token: 'localtoken123', roomToken: '1' };
  }
}

// ---------------------------------------------------------------------------
// 工具
// ---------------------------------------------------------------------------

function num(v: unknown): number | undefined {
  return typeof v === 'number' ? v : undefined;
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

function ints(v: unknown): number[] | undefined {
  return Array.isArray(v) ? v.map(Number) : undefined;
}
