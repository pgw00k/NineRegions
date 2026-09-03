import fs from 'fs'
import path from "path";
import { Logger } from '../core/Logger';

let LoadedSetting:any = {}

export function ReadSettingFile<T>(setting:string,preset:any = null,isCache:boolean = true):T {
    let resData:T|any = {}
    let filePath = path.join(`setting`,`${setting}.json`)
    try {
        if(!LoadedSetting[filePath])
        {
            let rawJson = fs.readFileSync(filePath,{encoding:"utf8"})
            let newData = JSON.parse(rawJson) as T;

            if(isCache)
            {
                LoadedSetting[filePath] = newData
            }

            resData = newData
        }else
        {
            resData = LoadedSetting[filePath]
        }
    } catch (err:any) {
        Logger.LogWarn(`ReadSettingFile error(${filePath}): ${err.message}`)
        if(preset && isCache)
        {
            LoadedSetting[filePath] = preset
            Logger.LogWarn(`Use preset on ${filePath}: `)
        }
    }

    return resData
}

export function WriteSettingFile(setting:string,preset:any = null,isCache:boolean = true) {
    let filePath = path.join(`setting`,`${setting}.json`)
    try {
        if(preset)
        {
            fs.writeFileSync(filePath,JSON.stringify(preset),{encoding:"utf8"})
            if(isCache)
            {
                LoadedSetting[filePath] = preset
            }
        }
    } catch (err:any) {
        Logger.LogWarn(`WriteSettingFile error(${filePath}): ${err.message}`)
    }
}