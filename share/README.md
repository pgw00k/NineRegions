# share — 共享层（schema + 静态编解码 + 代码生成）

本包 `mc-local-share` 是「供其他工程共用」的静态协议层，**不依赖任何动态 proto**：

- 从 `pack_msg` / lua 元数据一次性生成**静态 schema**（消息字段号/种类表）与 **MESSAGE_ID 枚举**；
- 提供基于该表的**静态编解码器**（`encoded`/`decodeMessage`），直接读写「以字段名为 key」的对象；
- 一份代码同时被 `backend` 与 gRPC 侧引用，避免两套 schema 漂移。

> 原则：`src/` 下的产物对外输出给其他工程（backend / gRPC）使用；`scripts/` 仅开发期生成用，不随构建产出。

---

## 目录结构

```
share/
├── src/
│   ├── proto/            # 生成产物：messages.ts / enums.ts / fields.ts / index.ts（供对外 import）
│   ├── MESSAGE_ID.ts     # 生成产物：reqId/recId 消息号枚举
│   ├── schema.ts         # MessageSchema + define（字段表登记）与 getByName
│   ├── codec.ts          # 静态编解码器 encodeMessage / decodeMessage（含 WireType=7 容错）
│   ├── common.ts         # FieldType / WireType 等数值枚举与线格式常量
│   └── index.ts          # 汇总导出
├── scripts/              # 开发期生成脚本（tsx 运行）
│   ├── parsePackMsg.ts   # 解析 pack_msg（FileDescriptorProto）
│   ├── generate_msg.ts   # 生成 MESSAGE_ID 枚举 + messages/enums TS
│   ├── generate_res.ts   # 生成 backend 的应答器文件（NetMsg_*.ts / MessageController）
│   ├── generate_ts.ts    # 生成字段名 schema 登记（fields.ts）与 schema/codec 消费
│   ├── generate_gRPC.ts  # 生成 gRPC 侧 message.proto / services.proto
│   └── luaMeta.ts        # 共享的 lua 配对解析（被多处复用）
├── msg/                  # 生成/参考资料（NetMsg_*.json 业务字段定义）
└── package.json
```

---

## 常用命令（backend 消费前需先 build）

```bash
pnpm --filter mc-local-share gen         # 生成消息 schema/MESSAGE_ID（generate_msg）
pnpm --filter mc-local-share gen:res     # 生成 backend 应答器（generate_res）
pnpm --filter mc-local-share gen:ts      # 生成字段 schema 登记表（generate_ts）
pnpm --filter mc-local-share gen:grpc    # 生成 gRPC proto（generate_gRPC）
pnpm --filter mc-local-share build       # tsc 编译到 dist/src（backend import 前必跑）
```

生成产物落在 `src/`（schema 类）与 `../backend/src/net/msg/`（应答器）等目标路径。

---

## codec 使用示例

```ts
import { get, encodeMessage, decodeMessage } from 'mc-local-share';

const schema = get(10001);                     // 按消息号取 schema（MessageSchema）
const obj    = decodeMessage(schema, pbuf);    // proto 字节 → 字段名对象
const bytes  = encodeMessage(schema, obj);     // 字段名对象 → proto 字节
```

要点与坑：
- 输入/输出对象一律**用字段名作为 key**，不是字段号（旧 `ProtobufEncoder` 用字段号会编坏）。
- `int64/sint64/fixed64` 走 Number 精度（大于 2^53 需谨慎）。
- 解码时对**保留线类型 7（WireType=7）**按「变长长度前缀」跳过并丢弃该未知字段，
  保证其后字段仍对齐、不崩溃（见 `codec.ts` `readFields`）。
- 嵌套 message 通过 `getByName` 按拍平类型名递归解析。

---

## 契约约定

- **生成产物请勿手改**；改业务 schema 从 `pack_msg`/`msg/*.json` 入手，改生成逻辑改 `scripts/*.ts`，
  改动后重新 `gen:xxx` + `build`。
- 后端不得维护本地 proto 副本，一律 `import 'mc-local-share'`。