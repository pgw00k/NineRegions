import { main } from '../src/server';
import { AddAllCardsToCard } from './checkCards';

export async function main_dev() {
    await main();
    AddAllCardsToCard();
}

main_dev();