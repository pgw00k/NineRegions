# data/game — 游戏静态数据（账号模拟数据源）

由 `tools/extract_account_data.py` 从客户端 lua 数据表（姊妹项目
`local_server/debug/lua/DataTable/`）提取的精简配置，供 `AccountDataStore`
生成玩家账号档案（卡牌库 / 英雄库 / 牌组库）。

重新提取：

```bash
cd backend
python tools/extract_account_data.py            # 使用默认输入/输出路径
python tools/extract_account_data.py <lua_dir> <out_dir>   # 自定义
```

---

## 文件

| 文件 | 内容 | 来源表 |
|---|---|---|
| `cards.json` | `cid → {formal, element, rarity}`（7610 张） | `TableCard_Cards.lua`（CardsDefine） |
| `heros.json` | `heroId → {jobs[], isFree, lockType}`（26 个） | `TableCard.lua`（HeroesDefine） |
| `heroSkills.json` | `heroId → 专属技能ID`（hero 1 → 100001） | `TableCard.lua`（HeroeUniqueSkills） |
| `decks.json` | `did → {hero, skill, cards[], class}`（3727 个预设牌组） | `TableCard_Decks.lua`（DecksDefine） |
| `classes.json` | `classId → {heroShowSort[]}`（11 个职业） | `TableCard.lua`（ClassDefine） |

## 关键枚举（客户端 JYTableEnum 实证）

- **LockType**：`0=Lock（锁定）`、`1=Challenge（可挑战解锁）`、`2=Unlocked（已解锁）`
- **ShopType**：`CardBag=1`（卡包/抽卡，EnterGameResponse.shopInfo 即此类型）、`PreBag=2`、`Hero=3`
- **英雄→职业**：hero i 属职业 i（heros.json jobs[0]），hero 101 全职业
- **英雄→技能**：hero i → 技能 10000i（heroSkills.json）

> 卡/英雄/牌组 ID 均来自真实配置，避免「随手编 ID 客户端查不到定义」的问题。
