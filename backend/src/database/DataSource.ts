import { ReadSettingFile } from "../utils/SettingHelper";
import { DataSource } from "typeorm";
import { Player } from "./data/Player";
import { UserLibrary } from "./data/UserLibrary";
import { Deck } from "./data/Deck";
import { CardLibrary } from "./data/CardLibrary";
import { Card } from "./data/Card";

export let DBBaseSetting: any = ReadSettingFile('db')

export let DBConnectCmd = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "",
    password: "",
    database: "",
    synchronize: true, // 开发环境下使用，生产环境应设为false
    logging: true,
    entities: [Player, UserLibrary, Deck, CardLibrary, Card],
    migrations: [],
    subscribers: [],
    ...DBBaseSetting
}

export const AppDataSource = new DataSource(DBConnectCmd)

/**
 * 数据库联通后需要在此处将各个服务初始化
 */
export function PostDBInit() {
    // 不能放在文件头，会造成循环引用？
    const { PlayerService } = require("./service/Player.service");
    const { UserLibraryService } = require("./service/UserLibrary.service");
    const { DeckService } = require("./service/Deck.service");
    const { CardLibraryService } = require("./service/CardLibrary.service");
    const { CardService } = require("./service/Card.service");

    let playerService = new PlayerService();
    let userLibraryService = new UserLibraryService();
    let deckService = new DeckService();
    let cardLibraryService = new CardLibraryService();
    let cardService = new CardService();
}