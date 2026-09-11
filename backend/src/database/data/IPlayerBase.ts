import { CardLibrarySimple, DeckLibrarySimple, HeroLibrarySimple, PlayerInfoSimple } from "mc-local-share";

export interface IPlayerBase {
    playerInfo?: PlayerInfoSimple;
    cardLibrary?: CardLibrarySimple;
    deckLibrary?: DeckLibrarySimple;
    heroLibrary?: HeroLibrarySimple;
}