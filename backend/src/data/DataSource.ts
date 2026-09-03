import { ReadSettingFile } from "../utils/SettingHelper";
import { DataSource } from "typeorm";

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
    entities: [],
    migrations: [],
    subscribers: [],
    ...DBBaseSetting
}

export const AppDataSource = new DataSource(DBConnectCmd);