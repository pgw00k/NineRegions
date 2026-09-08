import { ValueTransformer } from "typeorm";

export const DateTransformer: ValueTransformer = {
    // 数据库 -> TS: 把 PG 返回的 Date 对象转为毫秒时间戳
    from: (dbValue: Date): number => {
        if (!dbValue) {
            return 0;
        }
        return dbValue.getTime(); // 返回 number
    },
    // TS -> 数据库: 把 number 转为 Date 对象传给 PG
    to: (entityValue: number): Date => {
        return new Date(entityValue);
    },
}