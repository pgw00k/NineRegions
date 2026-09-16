/**
 * replay_bot_flow.ts — 人机回放流程端到端验证。
 *
 * 目的：验证 BattleBotRoom + BattlePlayerBotReplay 能让「真人 + 回放机器人」
 * 按日志时序自动跑完整局。
 *
 * 与 replay_battle.ts 的区别：
 *   - replay_battle.ts      ：脚本直接手动调用房间方法，验证 S2C 顺序；
 *   - replay_bot_flow.ts    ：只驱动真人侧消息，机器人侧由 BotReplay 自主提交，
 *                             验证「机器人能否真的补上 25006 / 25012」。
 *
 * 该脚本不依赖数据库：直接构造 BattleBotRoom 并注入内存卡组。
 */
import { MESSAGE_ID } from 'mc-local-share';
import { BattleBotRoom } from '../src/Battle/BattleBotRoom';
import { BattlePlayer } from '../src/Battle/BattlePlayer';
import { BattleConst } from '../src/Battle/BattleConst';
import { BattleHero } from '../src/Battle/BattleHero';

/** 回放中捕获到的一条 S2C */
interface CapturedS2C {
    msgId: number;
    data: any;
}

/** 只记录消息、不做真实网络发送的测试客户端 */
class MockClient {
    public uid: string;
    public captured: CapturedS2C[] = [];
    /** 每次收到指定消息时触发（用于把测试循环改成事件驱动） */
    public OnMessage?: (msgId: number, data: any) => void;
    constructor(uid: string) {
        this.uid = uid;
    }
    PushMessage(msgId: number, data: any): void {
        this.captured.push({ msgId, data });
        this.OnMessage?.(msgId, data);
    }
}

/** 使用内存卡组的真人玩家（绕过数据库） */
class ReplayHuman extends BattlePlayer {
    /** 覆盖基类读库逻辑：无数据库场景下直接使用默认玩家资料 */
    override async InitPlayerInfo(): Promise<void> {
        this.name = `真人测试${this.uid}`;
    }

    override async InitBattleInfo(_preset: any): Promise<void> {
        for (let i = 0; i < 40; i++) {
            this.DeckCards.push({
                uid: this.side * 1000 + i + 1,
                cid: 10000 + i,
                cost: 1,
                isMaterialized: false,
                abilitie: {
                    skillId: [],
                    passiveSkillId: [],
                    skillExpander: [],
                    atk: 1,
                    curDef: 1,
                    maxDef: 1,
                    isPrepare: false,
                    flyLayer: 0,
                    auraSkillId: [],
                },
            });
        }
        this.hero = new BattleHero({ side: this.side, heroID: 1, heroSkillID: 100001 });
        this.job = 1;
        this.cardBack = 50001;

        this.battleFields = [];
        for (let i = 0; i < BattleConst.FIELD_SIZE; i++) {
            this.battleFields.push({ index: i, hasCard: false, orgIndex: i });
        }
        this.DrawCard(BattleConst.INIT_HAND);
    }
}

/** 等待若干毫秒 */
function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
    /** 关闭机器人延迟，让测试快速跑完 */
    BattleBotRoom.BotDeployDelayMs = 0;
    BattleBotRoom.BotShowEndDelayMs = 0;

    const humanClient = new MockClient('1001');

    const room = new BattleBotRoom({
        RoomToken: 'TestRoom-BotReplay',
        BattleToken: 'TestBattleToken-BotReplay',
    });

    /**
     * 让机器人使用「不换牌 + 每轮上 3 张」的默认回放脚本；
     * side=2 时手牌 uid 落于 2001..2006。
     */
    if (room.Bot) {
        room.Bot.Script.ChangeCardUids = [];
    }

    /** 真人入场（side=1），机器人在构造函数中已自动入场（side=2） */
    await room.SetBattler({ uid: '1001', client: humanClient }, ReplayHuman as any);

    /** 房间必须集齐双方，否则永远等不到 BATTLE_START_REP */
    console.log(`[检查] 参战玩家：${(room as any).Battlers.length} 人（IsReady=${(room as any).IsReady}）`);

    /** 真人补充一次 25003 换牌（机器人侧由 BotReplay.OnDealStep 自动完成） */
    const beforeChange = humanClient.captured.length;
    const changeCardRep = await room.ChangeCard('1001', { cardUids: [], quickBattle: false });
    if (changeCardRep !== undefined) {
        const broadcasts = humanClient.captured.splice(beforeChange);
        humanClient.captured.push({ msgId: MESSAGE_ID.CHANGE_CARD_REP, data: changeCardRep });
        humanClient.captured.push(...broadcasts);
    }

    /**
     * 真人侧改为「事件驱动」：只在收到 25005 DEPLOYMENT_START_REP 时提交一次 25006。
     *
     * 这一点必须与真实客户端一致 —— 真人不会凭空轮询提交布阵，而是被动等部署阶段开启。
     * 若在循环里主动重复提交，DeployCompleted 会累积过期条目，导致回合推进错位
     * （表现为 roundNum 跳变、DEAL_STEP 缺失）。
     */
    let humanDeployCount = 0;
    let endSignal = false;
    humanClient.OnMessage = (msgId) => {
        if (msgId === MESSAGE_ID.DEPLOYMENT_START_REP) {
            humanDeployCount++;
            room.DeploymentComplete('1001', { action: [] });
        }
        if (msgId === MESSAGE_ID.BATTLE_END_REP) {
            endSignal = true;
        }
    };

    /**
     * 首轮 25003 已经触发过一次 DealStep/DeploymentStart（在 ChangeCard 内同步完成），
     * 但那时 OnMessage 还没挂上，故补一次首轮布阵提交。
     */
    await room.DeploymentComplete('1001', { action: [] });
    humanDeployCount++;

    /**
     * 之后全程等待：真人只对 25005 做出反应，机器人自己完成 25006 / 25012。
     */
    const deadline = Date.now() + 5000;
    while (!endSignal && Date.now() < deadline) {
        await sleep(20);
    }

    const actual = humanClient.captured.map((c) => c.msgId);
    const name = (id: number) => MESSAGE_ID[id] ?? String(id);
    const counter = new Map<number, number>();
    actual.forEach((id) => counter.set(id, (counter.get(id) ?? 0) + 1));

    console.log('──────────────────────────────────────────────');
    console.log(`真人侧收到的 S2C 共 ${actual.length} 条`);
    console.log(`真人布阵提交次数：${humanDeployCount}（应等于 DEPLOYMENT_START_REP 次数）`);
    console.log('──────────────────────────────────────────────');
    console.log('消息计数:');
    for (const [id, n] of counter) {
        console.log(`  ${name(id)}  ×${n}`);
    }
    console.log('──────────────────────────────────────────────');
    console.log('完整序列:');
    console.log('  ' + actual.map(name).join('\n  '));
    console.log('──────────────────────────────────────────────');

    const hasStart = counter.has(MESSAGE_ID.BATTLE_START_REP);
    const hasFightStart = (counter.get(MESSAGE_ID.FIGHT_START_REP) ?? 0) > 0;
    const hasFightStep = (counter.get(MESSAGE_ID.FIGHT_STEP_REP) ?? 0) > 0;
    const hasEnd = counter.has(MESSAGE_ID.BATTLE_END_REP);

    console.log(`BATTLE_START : ${hasStart ? '✅' : '❌'}`);
    console.log(`FIGHT_START  : ${hasFightStart ? '✅' : '❌'} (机器人布阵提交)`);
    console.log(`FIGHT_STEP   : ${hasFightStep ? '✅' : '❌'}`);
    console.log(`BATTLE_END   : ${hasEnd ? '✅ 机器人成功自动跑完整局' : '❌ 未走到战斗结束'}`);

    /**
     * 严格时序校验：逐条比对日志推导出的模式，而非只数个数。
     *
     *   BATTLE_START, CHANGE_CARD,
     *   { DEAL_STEP, DEPLOYMENT_START, FIGHT_START, FIGHT_STEP } × N,
     *   BATTLE_END
     *
     * 任何「重复的 FIGHT_START/FIGHT_STEP 对」「缺失的 DEAL_STEP」都会被判失败。
     */
    const expect: number[] = [MESSAGE_ID.BATTLE_START_REP, MESSAGE_ID.CHANGE_CARD_REP];
    const rounds = counter.get(MESSAGE_ID.DEAL_STEP_REP) ?? 0;
    for (let i = 0; i < rounds; i++) {
        expect.push(
            MESSAGE_ID.DEAL_STEP_REP,
            MESSAGE_ID.DEPLOYMENT_START_REP,
            MESSAGE_ID.FIGHT_START_REP,
            MESSAGE_ID.FIGHT_STEP_REP,
        );
    }
    expect.push(MESSAGE_ID.BATTLE_END_REP);

    let seqOk = actual.length === expect.length;
    let firstDiff = -1;
    if (seqOk) {
        for (let i = 0; i < expect.length; i++) {
            if (actual[i] !== expect[i]) {
                seqOk = false;
                firstDiff = i;
                break;
            }
        }
    } else {
        firstDiff = Math.min(actual.length, expect.length);
    }

    console.log(`时序严格匹配: ${seqOk ? '✅' : '❌'}`);
    if (!seqOk) {
        console.log(`  实际 ${actual.length} 条 / 期望 ${expect.length} 条，首个不一致位置 ${firstDiff}`);
        console.log(`  实际[${firstDiff}] = ${actual[firstDiff] !== undefined ? name(actual[firstDiff]) : '(缺失)'}`);
        console.log(`  期望[${firstDiff}] = ${expect[firstDiff] !== undefined ? name(expect[firstDiff]) : '(缺失)'}`);
        console.log(`  真人布阵提交 ${humanDeployCount} 次 / 期望 ${rounds} 次`);
    }
    console.log('──────────────────────────────────────────────');

    const ok = hasStart && hasFightStart && hasFightStep && hasEnd && seqOk;
    console.log(ok ? '✅ 人机回放流程通过' : '❌ 人机回放流程失败');
    process.exit(ok ? 0 : 1);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
