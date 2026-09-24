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
import { MESSAGE_ID, ActionType, AttackType, DeployActionSimple } from 'mc-local-share';
import { BattleRoom } from '../src/Battle/BattleRoom';
import { BattlePlayer } from '../src/Battle/BattlePlayer';
import { BattleConst } from '../src/Battle/BattleConst';
import { BattleHero } from '../src/Battle/BattleHero';
import { BattleCard } from '../src/Battle/BattleCard';
import { BattleField } from '../src/Battle/BattleField';
import { BattleEffectTable } from '../src/Battle/BattleEffectTable';

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
            let cardUid = this.side * 1000 + i + 1;
            this.AllCards[cardUid] = new BattleCard(10000 + i, {
                uid: cardUid,
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
            this.DeckUIDs.push(cardUid);
        }

        this.hero = new BattleHero({
            side: this.side,
            heroID: 6,
            /**
             * 用 100006（幻日英灵）而不是随便一个未实现的主将技：末轮提交的
             * SKILL(3) 布阵动作要靠它从 BattleEffectTable 建出主将技卡，
             * 才能走到「翻牌 → SpecialSummon」这条路径。
             */
            heroSkillID: 100006,
        });
        this.job = 1;
        this.cardBack = 50001;

        this.BattleFields = {};
        for (let i = 0; i < BattleConst.FIELD_SIZE; i++) {
            this.BattleFields[i] = new BattleField();
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
    if (rounds % 2 === 0) {
        console.error(`回放轮数必须是奇数：结束条件 RoundNum >= MaxRoundNum*2 与「每轮 +1」的回合号
只有奇数轮才能恰好落在最后一轮播完时（见下方 MaxRoundNum 推导）。`);
        process.exit(2);
    }

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
     * 结束条件（BattleRoom.IsBattleOver）是 `RoundNum >= MaxRoundNum * 2`，
     * 而服务端的回合号推进是：BattleStart 置 1 → 换牌阶段 RoundBegin → 2，
     * 之后每次「播完一轮表现」（ShowEnd → RoundBegin）**+1**
     * ⇒ 第 r 轮战斗时 RoundNum = 1 + r。
     * 要在第 `rounds` 轮打完后立刻收尾（BATTLE_END 紧跟该轮 FIGHT_STEP），需要
     *   1 + rounds >= 2 * MaxRoundNum  且  1 + (rounds-1) < 2 * MaxRoundNum
     * ⇒ 2 * MaxRoundNum 必须落在区间 (rounds, rounds+1] 内，而它是偶数，
     * 所以只有奇数 rounds 才有解：MaxRoundNum = (rounds + 1) / 2。
     */
    (room as any).MaxRoundNum = (rounds + 1) / 2;

    /**
     * 末轮由真人放下主将技卡：C2S 25006 带一条
     * `{ type=SKILL(3), index=<地块>, cardUid=<主将技卡 cid> }`。
     * 客户端原生链路（JYBattleOpStateDone.<DoProcedure>d__7.MoveNext 0x158C890）是
     * `MCCard.IsHeroSkillCard(card)` → `CreateBattleDeployPutAction(card, pos, isHeroSkill)`
     * → actionType = isHeroSkill*2+1，即**与普通落子同一条路**，只是类型码为 3。
     * 服务端把它当一张扣在地块上的 Magic 牌，翻牌时才结算出 4 个召唤物。
     */
    const heroSkillDeploy: DeployActionSimple[] = [
        { type: ActionType.SKILL, index: 0, cardUid: 100006 },
    ];

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

    /** 逐轮回放：布阵完成 → 双方播完表现 */
    let fights = 0;
    for (let r = 1; r <= rounds; r++) {
        /** C2S 25006 布阵完成（双方提交；这里机器人同步提交） */
        await room.DeploymentComplete('1001', { action: r === rounds ? heroSkillDeploy : [] });
        await room.DeploymentComplete('1', { action: [] });
        fights++;

        /**
         * C2S 25012 播完表现，推进下一轮（末轮触发 BATTLE_END）。
         * 必须双方都上报：ShowEnd 只认「两边都播完」，只报一方会卡在本轮。
         */
        await room.ShowEnd('1001');
        await room.ShowEnd('1');

        if (room.IsFinished()) {
            break;
        }
    }

    if (!room.IsFinished()) {
        console.error(`❌ 第 ${fights} 轮打完后战斗仍未结束：MaxRoundNum 推导或回合号推进已与实际不符`);
        process.exit(1);
    }

    /** 比对：期望序列 vs 实际产出（以真人客户端收到的为准） */
    const expected = buildExpectedFlow(fights);
    const actual = humanClient.captured.map((c) => c.msgId);
    const botActual = botClient.captured.map((c) => c.msgId);

    const name = (id: number) => MESSAGE_ID[id] ?? String(id);

    console.log('──────────────────────────────────────────────');
    console.log(`回放轮数: ${fights}`);
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

    ok = verifyHeroSkillMagic(humanClient, room) && ok;

    console.log(ok ? '✅ 战斗流程回放通过：S2C 交互顺序与日志一致，且主将技只播一次特写' : '❌ 战斗流程回放失败');
    process.exit(ok ? 0 : 1);
}

/**
 * 断言主将技（100006）作为 Magic 牌的完整链路：
 *   布阵落格 → 翻牌进墓 → Cards.SkillList→Skills→Buffers 派发 SpecialSummon
 *   → **一条** Skill 动作带 4 个 hit（客户端一次特写召唤 4 个单位）+ 4 条 Born。
 * 同时核对服务端状态（场上 4 个 100106）。
 */
function verifyHeroSkillMagic(client: MockClient, room: BattleRoom): boolean {
    let ok = true;
    const fail = (msg: string) => {
        ok = false;
        console.log(`✗ ${msg}`);
    };

    /** 末轮 25011（FightStepResponse）里的 actions */
    const steps = client.captured.filter((c) => c.msgId === MESSAGE_ID.FIGHT_STEP_REP);
    const actions: any[] = steps.length > 0 ? (steps[steps.length - 1].data?.actions ?? []) : [];
    const skillActions = actions.filter((a) => a.attackType === AttackType.Skill);
    const bornActions = actions.filter((a) => a.attackType === AttackType.Born);

    console.log(`末轮 25011：actions=${actions.length} Skill=${skillActions.length} Born=${bornActions.length}`);
    console.log(`  Skill hits=[${skillActions.map((a) => a.hits.length).join(',')}] ` +
        `落点=[${skillActions.flatMap((a) => a.hits.map((h: any) => h.field?.index)).join(',')}]`);

    /** 4 个召唤物必须是**一条**动作 ⇒ 客户端只播一次 Ultra 特写（旧实现是 4 条动作 = 4 次特写） */
    if (skillActions.length !== 1) {
        fail(`Skill 动作应为 1 条（一次特写），实际 ${skillActions.length} 条`);
    } else if (skillActions[0].hits.length !== 4) {
        fail(`Skill 动作应带 4 个 hit，实际 ${skillActions[0].hits.length} 个`);
    } else {
        const spec = BattleEffectTable.GetCard(100106)!;
        for (let h of skillActions[0].hits) {
            if (h.bufferId !== 100100006) { fail(`hit.bufferId 应为 100100006，实际 ${h.bufferId}`); break; }
            if (h.card?.cid !== 100106) { fail(`hit.card.cid 应为 100106，实际 ${h.card?.cid}`); break; }
            if (h.abilitie?.atk !== spec.atk || h.abilitie?.curDef !== spec.def) {
                fail(`hit.abilitie 应为 ${spec.atk}/${spec.def}，实际 ${h.abilitie?.atk}/${h.abilitie?.curDef}`);
                break;
            }
            /** 冲锋（1000001）必须带上，否则召唤物当回合不能进攻 */
            if (!(h.abilitie?.passiveSkillId ?? []).includes(1000001)) {
                fail(`hit.abilitie.passiveSkillId 应含 1000001（冲锋）`);
                break;
            }
        }
    }

    if (bornActions.length !== 4) {
        fail(`Born 动作应为 4 条（逐落点登场），实际 ${bornActions.length} 条`);
    }

    /** 服务端状态：末轮应留下 4 个 cid=100106 的单位 */
    const human = room.Battlers.find((b) => b.uid === '1001')!;
    const summons = Object.values(human.Units).filter((u) => u.cid === 100106);
    const fields = Object.entries(human.BattleFields)
        .filter(([, f]) => f.hasCard)
        .map(([i, f]) => `${i}:cid=${human.AllCards[f.cardUid]?.cid}`);
    console.log(`  服务端：100106 单位=${summons.length} 占格=[${fields.join(' ')}]`);
    if (summons.length !== 4) {
        fail(`服务端应有 4 个 100106 单位，实际 ${summons.length} 个`);
    }

    /** 主将技卡自身必须已进墓（翻开即消耗），不能还留在地块上 */
    if (!human.CemeteryUIDs.some((uid) => human.AllCards[uid]?.cid === 100006)) {
        fail(`主将技卡 100006 未进墓（说明翻牌/消耗链路没走到）`);
    }

    if (ok) {
        console.log('✅ 主将技 Magic 链路通过：1 条 Skill 动作（4 hit）+ 4 条 Born，一次特写召唤 4 个单位');
    }
    return ok;
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
