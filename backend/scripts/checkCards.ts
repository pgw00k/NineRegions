import path from 'path';
import { CardLibraryService } from '../src/database/service/CardLibrary.service';
import { loadCards } from './cards';
import { CardService } from '../src/database/service/Card.service';
import { Card } from '../src/database/data/Card';

let CARD_ALL = path.resolve('..', 'data', 'Cards.json');

export function checkCards(): void {
  const { cards, skipped } = loadCards(CARD_ALL);
  console.log(`Cards.json parsed: ${cards.size} cards, ${skipped.length} skipped.`);
  const first = cards.get(10001);
  if (first) {
    console.log('Sample card 10001:');
    console.log(JSON.stringify(first, null, 2));
  }
  let nonMagic = 0;
  let huge = 0;
  let token = 0;
  for (const card of cards.values()) {
    if (!card.IsMagic) nonMagic++;
    if (card.IsHuge) huge++;
    if (card.IsToken) token++;
  }
  console.log(`Non-magic: ${nonMagic}, huge: ${huge}, token: ${token}`);
}

/**
 * 给指定玩家添加所有正式卡牌到库中
 */
export function AddAllCardsToPlayer(uid: number): void {
  const { cards, skipped } = loadCards(CARD_ALL);
  console.log(`Cards.json parsed: ${cards.size} cards, ${skipped.length} skipped.`);
  let cids: number[] = [];
  for (const card of cards.values()) {
    if (!card.IsFormal) continue;
    for (let i = 0; i < 3; i++) {
      cids.push(card.ID);
    }
  }
  console.log(`Add ${cids.length / 3} cards to ${uid} library.`);
  CardLibraryService.Instance.AddCards(uid, cids);
}

/**
 * 批量添加所有正式卡牌到数据库
 */
export function AddAllCardsToCard(): void {

  const { cards, skipped } = loadCards(CARD_ALL);
  console.log(`Cards.json parsed: ${cards.size} cards, ${skipped.length} skipped.`);
  let dbCards: Partial<Card>[] = [];
  for (const card of cards.values()) {
    if (!card.IsFormal) continue;
    dbCards.push({
      cid: card.ID,
      IsFormal: card.IsFormal,
      IsMagic: card.IsMagic ? 1 : 0,
      cost: card.Cost,
      
      atk: card.Atk,
      def: card.Def,
      rarity: card.Rarity,
      skillId: card.SkillList,
      passiveSkillId: card.PassiveSkilllist,
      auraSkillId: card.AruaList,
      IsHuge: card.IsHuge,
      FlyLayer: card.FlyLayer,
    });
  }

  CardService.Instance.AddCards(dbCards);
}
