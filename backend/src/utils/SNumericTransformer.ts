import { ValueTransformer } from "typeorm";

// 1. 定义转换器
export const SNumericTransformer: ValueTransformer = {
    // 写入数据库时的转换
    to(value: any): number | null {
        if (value === '' || value === null || value === undefined || isNaN(Number(value))) {
            return 0; // 转换为0
        }
        return Number(value);
    },
    // 从数据库读取时的转换（根据需要定义）
    from(value: number | null): string | null {
        return value?.toString() || null;
    }
};