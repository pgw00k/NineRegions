# NineRegions
[toc]

本项目为Windows端仙剑奇侠传九野的本地模拟服务器。

借助了AI神力，主要集中在网络帧分析和封包结构分析部分，也就是 `backend/src/net` 中的相关内容，手动修改了一部分结构和函数，增加了一些OOP设计，方便后续拓展。

## 开发环境和技术栈
- Windows10 22H2
- node v22.8.0
- [PostgreSQL 18.6](https://get.enterprisedb.com/postgresql/postgresql-18.6-4-windows-x64-binaries.zip)

## 快速流程
当前的版本主要面向开发者，前置环境请直接参考环境说明。

客户端：[https://pan.baidu.com/s/1yof9gGeNWao2W1Rmh8NTlw?pwd=3950](https://pan.baidu.com/s/1yof9gGeNWao2W1Rmh8NTlw?pwd=3950)

简要说明：[https://www.bilibili.com/video/BV1jYpN6vEPn](https://www.bilibili.com/video/BV1jYpN6vEPn)

1. clone 完成后，先安装node的基础环境，由于使用了pnpm作为包管理器（主要是为了将协议层share进行单独隔离0）而不是npm，所以硬性要求pnpm，使用 `pnpm install` 或者 `npm run install:all` 来安装都可以。
2. 下载 [backend_ex.zip](https://github.com/pgw00k/NineRegions/releases/download/ex/backend_ex.zip) 解压到 backend 目录中
3. 使用 `001_InitDB.bat` 文件来快速初始化本地数据库，需要设置psql的bin目录，同时要确保有 **init_mc.backup** 文件，不然没有用户数据。
4. 在根目录使用 `pnpm run dev` 或者 `pnpm --filter mc-local-backend dev`(需要先 `pnpm --filter mc-local-share build`) 来启动后端

## 子包

- **[`backend/`](backend/)** — 主要后端：「C2S 密文解密 → 路由 → S2C 应答」的 WS 网关 + HTTP 登录仿真。
可打包为独立 `nine-regions-backend.exe`（不依赖 Node）。

- **[`share/`](share/)** — 共享层（`mc-local-share`）：处理网络协议相关的内容，作为模块提供给后端。一定程度上将协议和业务逻辑进行隔离，有需要的话可以把这里的定义喂给AI，通过这里结构接入到其他后端去。

## 已知问题
网络部分socket包没有处理粘包和断包的问题，所以如果出现一些解析或者封包结构错误，有可能就是粘包了或直接数据截断错误导致卡住了，可以尝试重启客户端。

服务端是绝对权威的，客户端更多的只是作为一个“播放器”的角色存在，主要用来播放和响应服务端返回的 **Action**，所以所有的技能等相关实现需要在服务端实现。

由于一开始做的时候没考虑S/C消息的架构，所以函数命名上搞得很随便，后续开发的话建议使用S2C和C2S等前缀来标明函数方向。