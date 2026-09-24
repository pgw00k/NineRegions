/**
 * 战斗房间快照序列化。
 *
 * 目标：把内存里的 BattleRoom（含双方 BattlePlayer / BattleHero / BattleCard /
 * BattleUnit / BattleField 对象图）原样存成 JSON，进程重启后再重建，
 * 使客户端的 20001 弱重连能接上一场没打完的战斗。
 *
 * 两条硬约束决定了实现方式：
 *  1) **不能靠构造函数重建**。BattleBotRoom 的构造函数会 SetBattler → 读数据库 →
 *     InitBattleInfo → ShuffleDeck + 重置血量，重建出来的是「开局」而不是「残局」。
 *     所以重建用 `Object.create(proto)` + 逐字段回填，之后再调 AfterRestore() 补派生字段。
 *  2) **只存战斗状态，不存连接状态**。Client / Promise / 回调函数属于当前进程的连接期
 *     对象，必须跳过，重连时重新换绑、恢复时重新注入。
 *
 * 类身份用 `$c` 标签记录，重建时查显式注册表：各战斗类在自己的文件末尾登记
 * （见 BattlePlayer / BattleRoom / BattleBotRoom / BattlePlayerBotReplay），
 * 未注册的类直接抛错而不是静默降级成普通对象 —— 否则恢复出来的对象会缺方法，
 * 表现为运行期 TypeError，比启动期报错难查得多。
 */

/** 快照协议版本：结构不兼容时递增，加载端按版本拒绝旧快照 */
export const SNAPSHOT_VERSION = 1;

/** 类标签字段名 */
const CLASS_TAG = '$c';

/**
 * 连接期 / 可派生字段：不入库。
 *  连接期 / 可派生字段：不入库。
 *  - client / initPromises：当前进程的 WebSocket 上下文与 Promise
 *  - Battlers：由 BattlersDict 按 side 排序派生（见 BattleRoom.TryBattleStart）
 *  - Bot：与 BattlersDict['1'] 是同一个对象，重复存储会断开引用
 *  - ResumePending：由 AfterRestore() 决定，存回来只会留下过期值
 */
const SKIP_PROPS = new Set(['client', 'initPromises', 'Battlers', 'Bot', 'ResumePending']);

/** 类名 → 构造函数。由战斗层显式注册，避免本模块反向 import 战斗类形成循环。 */
const classRegistry = new Map<string, new (...args: any[]) => any>();

/** 快照文件内容 */
export interface BattleSnapshotFile {
    version: number;
    /** 落盘时间戳（毫秒），用于 TTL 过滤 */
    savedAt: number;
    roomToken: string;
    /** 当时**已连接**（有 Client）的参战者 uid，供重建 uid→roomToken 索引 */
    uids: string[];
    /** 序列化的房间对象图 */
    room: unknown;
}

/** 注册可重建的战斗类（重连恢复依赖它；漏注册会在启动期抛错） */
export function RegisterBattleClasses(classes: Record<string, new (...args: any[]) => any>): void {
    for (const [name, ctor] of Object.entries(classes)) {
        classRegistry.set(name, ctor);
    }
}

/** 战斗层恢复钩子（BattleRoom / BattleBotRoom 各自实现） */
export interface IRestorableBattle {
    AfterRestore?(): void;
}

function isPlainObject(v: object): boolean {
    const proto = Object.getPrototypeOf(v);
    return proto === Object.prototype || proto === null;
}

/**
 * 沿原型链找最近的已注册基类名。
 * 未注册的本层子类（测试里的 ReplayHuman extends BattlePlayer 等）按基类形态存回：
 * 子类多出来的只是本进程的辅助字段，恢复后靠基类方法即可继续驱动。
 * 整条链都没命中才判为不可序列化。
 */
function resolveRegisteredClass(obj: object): string | undefined {
    for (let proto = Object.getPrototypeOf(obj); proto; proto = Object.getPrototypeOf(proto)) {
        const name = (proto.constructor as { name?: string } | undefined)?.name;
        if (name && classRegistry.has(name)) return name;
    }
    return undefined;
}

/** 递归序列化；函数 / undefined 丢弃，非 plain / 非内置类的实例必须已注册。 */
function encode(value: unknown): unknown {
    if (value === null || value === undefined) {
        return undefined;
    }
    const t = typeof value;
    if (t === 'function' || t === 'symbol' || t === 'bigint') {
        return undefined;
    }
    if (t !== 'object') {
        return value;
    }
    if (Array.isArray(value)) {
        return value.map((v) => encode(v) ?? null);
    }
    const obj = value as object;
    if (isPlainObject(obj)) {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(obj)) {
            if (SKIP_PROPS.has(k)) continue;
            const e = encode(v);
            if (e !== undefined) out[k] = e;
        }
        return out;
    }
    const ctor = (obj as { constructor?: { name?: string } }).constructor;
    const name = resolveRegisteredClass(obj);
    if (!name) {
        throw new Error(
            `快照：未注册的战斗类「${ctor?.name ?? '(匿名)'}」，请加入 RegisterBattleClasses`
        );
    }
    const out: Record<string, unknown> = { [CLASS_TAG]: name };
    for (const [k, v] of Object.entries(obj)) {
        if (SKIP_PROPS.has(k)) continue;
        const e = encode(v);
        if (e !== undefined) out[k] = e;
    }
    return out;
}

/** 递归反序列化；带 $c 标签的用 Object.create 还原原型链（getter / 方法即刻可用）。 */
function decode(value: unknown): unknown {
    if (value === null || typeof value !== 'object') {
        return value;
    }
    if (Array.isArray(value)) {
        return value.map(decode);
    }
    const obj = value as Record<string, unknown>;
    const tag = obj[CLASS_TAG];
    const target: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
        if (k === CLASS_TAG) continue;
        target[k] = decode(v);
    }
    if (typeof tag !== 'string') {
        return target;
    }
    const ctor = classRegistry.get(tag);
    if (!ctor) {
        throw new Error(`快照恢复：未注册的战斗类「${tag}」`);
    }
    const inst = Object.create(ctor.prototype) as Record<string, unknown>;
    Object.assign(inst, target);
    return inst;
}

/** 房间对象图 → 可直接 JSON.stringify 的结构 */
export function SerializeBattleRoom(room: object): unknown {
    return encode(room);
}

/**
 * 快照结构 → 房间实例。
 * 只做重建与 AfterRestore，不做任何「补发阶段消息」的事（那是 ResumeAfterRestore 的职责）。
 */
export function DeserializeBattleRoom(data: unknown): object {
    const room = decode(data) as IRestorableBattle;
    room.AfterRestore?.();
    return room as object;
}

/** 组装快照文件内容 */
export function BuildBattleSnapshot(room: object & { RoomToken: string; Battlers: { uid: string; client?: unknown }[] }): BattleSnapshotFile {
    return {
        version: SNAPSHOT_VERSION,
        savedAt: Date.now(),
        roomToken: room.RoomToken,
        /** 只登记当时在线的 uid：重启后它们才是「值得回战」的对象 */
        uids: room.Battlers.filter((b) => !!b.client).map((b) => b.uid),
        room: SerializeBattleRoom(room),
    };
}
