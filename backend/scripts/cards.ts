import * as fs from 'fs';
import * as path from 'path';

export interface CardDefine {
  ID: number;
  Version: string;
  IsFormal: number;
  IsFree: number;
  IsMagic: boolean;
  Name: string;
  Desc: string;
  Cost: number;
  Atk: number;
  Def: number;
  Rarity: number;
  Meta: number;
  Element: number;
  Race1: number;
  Race2: number;
  SkillList: number[];
  PassiveSkilllist: number[];
  AruaList: number[];
  IsHuge: boolean;
  FlyLayer: number;
  GroupId: number;
  UseCondition: number;
  FobCondition: number;
  Priority: number;
  AIClass: number;
  AITarget: number;
  Story: string;
  Score: string;
  CompoundItem1: number;
  CompoundItem1Number: number;
  CompoundItem2: number;
  CompoundItem2Number: number;
  ResolveGetItem1: number;
  ResolveGetItem1Number: number;
  ResolveGetItem2: number;
  ResolveGetItem2Number: number;
  ChessEffect: string;
  Painter: string;
  AttackPlusTime: number;
  SummonPlusTime: number;
  DeadPlusTime: number;
  CardSpeed: number;
  CardType1: number;
  CardType2: number;
  InfiCardID: number;
  CardLevel: number;
  NextLevel: number;
  Price: number;
  Keywords: number[];
  Addweight: number;
  UnitTableIndex: number;
  BattleShowIndex: number;
  ResolveOrNot: number;
  ExtraPriority: number;
  SkillTags: number[];
  AIDamageType: number;
  AIDamage: number;
  ItemIcon: string;
  CameraSet: number;
  ConditionLight: number[];
  CVName: string;
  IsToken: number;
  TokenCard: number;
}

export type CardsJson = Record<string, unknown>;

export function readCardsJson(filePath:string): CardsJson {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as CardsJson;
}

export function isCardDefine(value: unknown): value is CardDefine {
  if (typeof value !== 'object' || value === null) return false;
  const card = value as CardDefine;
  return (
    typeof card.ID === 'number' &&
    Number.isInteger(card.ID) &&
    typeof card.Name === 'string' &&
    typeof card.IsMagic === 'boolean' &&
    typeof card.IsHuge === 'boolean' &&
    Array.isArray(card.SkillList) &&
    Array.isArray(card.PassiveSkilllist) &&
    Array.isArray(card.AruaList) &&
    Array.isArray(card.Keywords) &&
    Array.isArray(card.SkillTags) &&
    Array.isArray(card.ConditionLight)
  );
}

export interface ParseResult {
  cards: Map<number, CardDefine>;
  skipped: string[];
}

export function parseCards(json: CardsJson): ParseResult {
  const cards = new Map<number, CardDefine>();
  const skipped: string[] = [];
  for (const [key, value] of Object.entries(json)) {
    const id = Number(key);
    if (!Number.isInteger(id) || !isCardDefine(value) || value.ID !== id) {
      skipped.push(key);
      continue;
    }
    cards.set(id, value);
  }
  return { cards, skipped };
}

let cache: ParseResult | null = null;

export function loadCards(filePath:string): ParseResult {
  if (cache) return cache;
  cache = parseCards(readCardsJson(filePath));
  return cache;
}
