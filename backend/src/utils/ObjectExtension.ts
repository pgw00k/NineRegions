/**
 * 根据ref对target进行裁剪（保留指定字段）
 * @param obj1 
 * @param obj2 
 */
export function Extract<T>(target: any, ref: any | string[]): Partial<T> {
    let newObject: any = {}
    let keys = Array.isArray(ref) ? ref : Object.keys(ref)
    keys.forEach((field) => {
        if (target.hasOwnProperty(field)) {
            newObject[field] = target[field]
        }
    })

    return newObject
}

/**
 * 根据keys对obj进行裁剪（删除指定字段）
 * @param obj 
 * @param keys 
 */
export function Omit<T>(target: any, ref: any | string[]): Partial<T> {
    const newObject = { ...target };
    let keys = Array.isArray(ref) ? ref : Object.keys(ref)
    keys.forEach((field) => {
        if (target.hasOwnProperty(field)) {
            delete newObject[field]
        }
    })
    return newObject;
}
