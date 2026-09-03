import { ReadSettingFile } from "../utils/SettingHelper";

const RawConfig = {
    /**
     * 是否使用模拟数据
     */
    UseMock: true,
}

const EnvConfig = ReadSettingFile<any>('server',{});
export const ServerConfig = {
    ...RawConfig,
    ...EnvConfig,
}
