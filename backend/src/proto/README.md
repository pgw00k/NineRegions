# proto — protobuf 编解码与 schema

本目录把官方 `pack_msg`（protobuf `FileDescriptorSet`）解析成「消息名 → 字段 schema」映射，
并据此把**以字段号(key)为键**的 mock 对象递归编码成合法 protobuf 字节。

> 选择「零依赖自研」而非 `protobufjs`：官方 schema 字段名歧义多（不同 package 同名），
> 且 `node --experimental-strip-types` 不支持 enum，**必须用 tsc 编译**。

---

## 文件清单

| 文件 | 职责 |
|---|---|
| `ProtobufCodec.ts` | 线格式原语：varint / zigzag / 定长 / 读原始字段（含 64 位 BigInt）/ float / double 编解码 + `WireType` 枚举 |
| `SchemaRegistry.ts` | 解析 `pack_msg` 成 message schema，提供短名/全限定名查找与 `resolve(typeName)` |
| `ProtobufEncoder.ts` | 按字段号递归编码 mock 对象（varint/string/bytes/message/repeated/enum/fixed/float/double）|
| `generated/message-registry.json` | 由 `tools/extract_registry.py` 生成的「消息号 ↔ protobuf 类型」权威注册表 |

---

## SchemaRegistry

```ts
const reg = SchemaRegistry.load(PACK_MSG_PATH_ABS); // 解析 pack_msg
reg.getByShortName('EnterGameResponse');            // 短名查找（mock 用）
reg.getByFullName('.LoginBySDKRequest');            // 全限定名
reg.resolve('.pkg.Foo');                            // 解析 type_name（含短名末段兜底）
reg.messageCount;                                   // 已解析消息/类型总数（约 506）
```

- 零依赖：用 `ProtobufCodec.readRawFields` 把任意 protobuf 拆成 `{field → RawField[]}`，再按 `descriptor.proto` 字段号逐层解释。
- 同时登记**全限定名**（带前导点）与**短名**索引。mock 注册表用短名，故短名查找为主。
- 嵌套 message / enum 递归登记；短名冲突（不同 package 同名）保留首个。
- 类型映射见 `ParseField`：字段号 1=name, 3=number, 4=label, 5=type, 6=type_name。

---

## ProtobufEncoder

```ts
const enc = new ProtobufEncoder(registry);
const schema = registry.getByShortName('HeartbeatRep')!;
const bytes = enc.encode(schema, { '1': { '1': 1700000000, '2': 8 }, '2': false });
```

编码规则（值 → 线格式）：
- `number/boolean/整型枚举` → varint（bool→0/1；sint 走 ZigZag）。
- `string` → length-delimited UTF-8。
- `bytes` → 支持 `{hex}` / `{b64}` / 纯 hex（偶数长度）/ base64 字符串。
- `object` → 嵌套 message（递归，`registry.resolve(typeName)`）。
- `array` → repeated（非 packed，逐元素编码）。
- `float` / `double` → 定长（IEEE754 小端）。
- 未知字段号默认**跳过（不抛错）**，`EncodeOptions.skipUnknownFields=false` 时抛错。

> 注意：嵌套 message 字段要求「对象值」。例如 `HeartbeatRep.timestamp`(字段1) 是子消息，
> 应填 `{ '1': { '1': seconds, '2': zone } }` 而非标量（参考 `gateway.py` 把 timestamp 编码为 `{seconds, zone}`）。

---

## 设计要点

- **字段号 keyed**：mock JSON 用字段号做 key，彻底规避 protobufjs 字段名歧义，且对未知字段健壮。
- **schema 驱动**：类型/标签来自官方 `pack_msg`，编码线格式严格正确（含 sint ZigZag、float/double 定长）。
- **确定性**：字段按 `fieldOrder`（出现顺序）编码，保证可回环比对。
