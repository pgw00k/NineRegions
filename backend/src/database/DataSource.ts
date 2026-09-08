import { ReadSettingFile } from "../utils/SettingHelper";
import { DataSource } from "typeorm";
import { Player } from "./data/Player";
import { UserLibrary } from "./data/UserLibrary";
import { Deck } from "./data/Deck";



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
    entities: [Player, UserLibrary, Deck],
    migrations: [],
    subscribers: [],
    ...DBBaseSetting
}

export const AppDataSource = new DataSource(DBConnectCmd)

/**
 * 数据库联通后需要在此处将各个服务初始化
 */
export function PostDBInit() {
    const { PlayerService } = require("./service/Player.service");
    const { UserLibraryService } = require("./service/UserLibrary.service");
    const { DeckService } = require("./service/Deck.service");
    let playerService = new PlayerService();
    let userLibraryService = new UserLibraryService();
    let deckService = new DeckService(AppDataSource);
}