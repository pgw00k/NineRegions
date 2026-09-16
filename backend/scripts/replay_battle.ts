/**
 * replay_battle.ts — 战斗流程回放验证。
 *
 * 目的（对应任务：验证能否跑通战斗流程）：
 *   以客户端历史日志（JYLog_Backup）中一场完整对战的 **C2S 交互序列** 为输入，
 *   驱动当前服务端的 BattleRoom，收集其产出的 S2C，与日志中记录的 S2C 序列逐条比对。
 *
 * 日志中还原出的权威序列（见 JYLog_Backup/2022-02-27/_2022-02-27-13-10-19.log）：
 *
 *   SEND 25001 BATTLE_READY_REQ        → RECV 25002 BATTLE_START_REP
 *   SEND 25003 CHANGE_CARD_REQ         → RECV 25004 CHANGE_CARD_REP
 *                                      → RECV 25010 DEAL_STEP_REP
 *                                      → RECV 25005 DEPLOYMENT_START_REP
 *   SEND 25006 DEPLOYMENT_COMPLETE_REQ → RECV 25007 FIGHT_START_REP
 *                                      → RECV 25011 FIGHT_STEP_REP
 *   SEND 25012 SHOW_END_REQ            → RECV 25010 DEAL_STEP_REP
 *                                      → RECV 25005 DEPLOYMENT_START_REP
 *   …（每轮重复 25006 / 25012），直到 RECV 25008 BATTLE_END_REP
 *
 * 注意：C2S 25003 只在开局调用 **一次**，之后每轮由 25006 → 25007+25011 → 25012 → 25010+25005 循环。
 *
 * 该脚本不依赖数据库：直接构造 BattleRoom / BattlePlayer 并注入内存中的最小卡组。
 */
import { MESSAGE_ID } from 'mc-local-share';
import { BattleRoom } from '../src/Battle/BattleRoom';
import { BattlePlayer } from '../src/Battle/BattlePlayer';
import { BattleConst } from '../src/Battle/BattleConst';
import { BattleHero } from '../src/Battle/BattleHero';

/** 回放中捕获到的一条 S2C */
interface CapturedS2C {
    msgId: number;
    data: any;
}

/**
 * 一个只记录消息、不做真实网络发送的测试客户端。
 * BattlePlayer.SendMessage 会调用 client.PushMessage，这里把结果收进 captured。
 */
class MockClient {
    public uid: string;
    public captured: CapturedS2C[] = [];
    constructor(uid: string) {
        this.uid = uid;
    }
    PushMessage(msgId: number, data: any): void {
        this.captured.push({ msgId, data });
    }
}

/**
 * 构造一个使用内存卡组的 BattlePlayer（绕过数据库）。
 */
class ReplayPlayer extends BattlePlayer {
    /** 覆盖数据库读取，直接给出最小卡组 */
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

        this.hero = new BattleHero({
            side: this.side,
            heroID: 1,
            heroSkillID: 100001,
        });
        this.job = 1;
        this.cardBack = 50001;

        this.battleFields = [];
        for (let i = 0; i < BattleConst.FIELD_SIZE; i++) {
            this.battleFields.push({ index: i, hasCard: false, orgIndex: i });
        }

        this.DrawCard(BattleConst.INIT_HAND);
    }
}

/**
 * 日志中还原出的「期望 S2C 序列」（按回合循环展开）。
 *
 *   开局：  BATTLE_START
 *   首轮：  CHANGE_CARD + DEAL_STEP + DEPLOYMENT_START
 *   每轮：  FIGHT_START + FIGHT_STEP（战斗），
 *          若非末轮则 SHOW_END 推进 → DEAL_STEP + DEPLOYMENT_START（下一轮抽牌/部署）
 *   收尾：  BATTLE_END
 */
function buildExpectedFlow(rounds: number): number[] {
    const expected: number[] = [];
    expected.push(MESSAGE_ID.BATTLE_START_REP);

    /** 首轮：换牌应答 + 抽牌 + 部署 */
    expected.push(MESSAGE_ID.CHANGE_CARD_REP);
    expected.push(MESSAGE_ID.DEAL_STEP_REP);
    expected.push(MESSAGE_ID.DEPLOYMENT_START_REP);

    for (let r = 1; r <= rounds; r++) {
        /** 布阵完成 → 战斗开始 → 战斗表现 */
        expected.push(MESSAGE_ID.FIGHT_START_REP);
        expected.push(MESSAGE_ID.FIGHT_STEP_REP);

        /** 非末轮：播完表现推进下一轮（抽牌 + 部署） */
        if (r < rounds) {
            expected.push(MESSAGE_ID.DEAL_STEP_REP);
            expected.push(MESSAGE_ID.DEPLOYMENT_START_REP);
        }
    }

    expected.push(MESSAGE_ID.BATTLE_END_REP);
    return expected;
}

async function main() {
    const rounds = Number(process.argv[2] ?? 3);

    const humanClient = new MockClient('1001');
    const botClient = new MockClient('1');

    const room = new BattleRoom({
        RoomToken: 'TestRoom-395085356',
        BattleToken: 'TestBattleToken-395085356',
    });

    /** 两名参战者：side 1 = 真人，side 2 = 机器人 */
    await room.SetBattler({ uid: '1001', client: humanClient }, ReplayPlayer as any);
    await room.SetBattler({ uid: '1', client: botClient }, ReplayPlayer as any);

    /**
     * 回放轮数受房间最大回合数约束：ShowEnd 中判定 `RoundNum >= MaxRoundNum * 2` 即结束。
     * 首轮换牌为 1，之后每轮 +2（FightStart / ShowEnd 各 +1），因此 N 轮后 RoundNum = 2N+1。
     * 令 MaxRoundNum = rounds，使第 rounds 轮播完后正好触发 BATTLE_END。
     */
    (room as any).MaxRoundNum = rounds;

    /**
     * C2S 25003 换牌（仅开局一次；换 0 张，模拟直接跳过）。
     *
     * 注意真实链路顺序（Client.process）：
     *   ① responder.Handle(25003) → BattleRoom.ChangeCard
     *   ② 但 25004 由 Client.process 在 Handle 返回后才 PushMessage(responder.recId, rep)；
     *   ③ 而 ChangeCard 内部先广播了 25010 / 25005。
     * 因此日志中的真实顺序是 25004 → 25010 → 25005，
     * 这里通过「先记录 25004，再把期间产生的广播顺延」来复原该顺序。
     */
    const beforeChange = humanClient.captured.length;
    const changeCardRep = await room.ChangeCard('1001', { cardUids: [], quickBattle: false });

    if (changeCardRep !== undefined) {
        /** 取出 ChangeCard 期间新增的广播（25010/25005），把 25004 插到它们之前 */
        const broadcasts = humanClient.captured.splice(beforeChange);
        humanClient.captured.push({
            msgId: MESSAGE_ID.CHANGE_CARD_REP,
            data: changeCardRep,
        });
        humanClient.captured.push(...broadcasts);
    }

    /** 逐轮回放：布阵完成 → 播放完毕 */
    for (let r = 1; r <= rounds; r++) {
        /** C2S 25006 布阵完成（双方提交；这里机器人同步提交） */
        await room.DeploymentComplete('1001', { action: [] });
        await room.DeploymentComplete('1', { action: [] });

        /** C2S 25012 播放完毕，推进下一轮（末轮触发 BATTLE_END） */
        await room.ShowEnd('1001');
    }

    /** 比对：期望序列 vs 实际产出（以真人客户端收到的为准） */
    const expected = buildExpectedFlow(rounds);
    const actual = humanClient.captured.map((c) => c.msgId);
    const botActual = botClient.captured.map((c) => c.msgId);

    const name = (id: number) => MESSAGE_ID[id] ?? String(id);

    console.log('──────────────────────────────────────────────');
    console.log(`回放轮数: ${rounds}`);
    console.log('──────────────────────────────────────────────');
    console.log('期望 S2C 序列:');
    console.log('  ' + expected.map(name).join('\n  '));
    console.log('──────────────────────────────────────────────');
    console.log(`实际 S2C 序列 (真人 side1, ${actual.length} 条):`);
    console.log('  ' + actual.map(name).join('\n  '));
    console.log('──────────────────────────────────────────────');

    let ok = actual.length === expected.length;
    const max = Math.max(actual.length, expected.length);
    for (let i = 0; i < max; i++) {
        if (actual[i] !== expected[i]) {
            ok = false;
            console.log(`✗ #${i} 期望=${name(expected[i])} 实际=${actual[i] === undefined ? '(缺失)' : name(actual[i])}`);
        }
    }

    console.log(`机器人 side2 收到 ${botActual.length} 条`);
    console.log('──────────────────────────────────────────────');
    console.log(ok ? '✅ 战斗流程回放通过：S2C 交互顺序与日志完全一致' : '❌ 战斗流程回放失败：S2C 交互顺序存在偏差');
    process.exit(ok ? 0 : 1);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
