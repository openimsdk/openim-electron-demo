<p align="center">
    <a href="https://openim.io">
        <img src="./docs/images/logo.jpg" width="60%" height="30%"/>
    </a>
</p>

# OpenIM Electron 💬💻

<p>
  <a href="https://docs.openim.io/">OpenIM Docs</a>
  •
  <a href="https://github.com/openimsdk/open-im-server">OpenIM Server</a>
  •
  <a href="https://github.com/openimsdk/openim-sdk-js-wasm">openim-sdk-wasm</a>
  •
  <a href="https://github.com/openimsdk/openim-sdk-electron">openim-sdk-electron</a>
  •
  <a href="https://github.com/openimsdk/openim-sdk-core">openim-sdk-core</a>
</p>
OpenIM 为开发者提供开源即时通讯 SDK，作为 Twilio、Sendbird 等云服务的替代方案。借助 OpenIM，开发者可以构建安全可靠的即时通讯应用，如 WeChat、Zoom、Slack 等。

本仓库基于开源版 OpenIM SDK 开发，提供了一款基于 Electron 的即时通讯应用。您可以使用此应用程序作为 OpenIM SDK 的参考实现。本项目同时引用了 `@openim/electron-client-sdk` 和 `@openim/wasm-client-sdk`，分别为 Electron 版本和 Web 版本的 SDK，可以同时构建 PC Web 程序和桌面应用（Windows、macOS、Linux）。

<p align="center">
    <img src="./docs/images/preveiw.zh-CN.png" alt="预览图" width="80%"/>
</p>

## 授权许可 :page_facing_up:

本仓库采用 GNU Affero 通用公共许可证第 3 版 (AGPL-3.0) 进行许可，并受以下附加条款的约束。**不允许用于商业用途**。详情请参阅 [此处](./LICENSE)。

## 开发环境

在开始开发之前，请确保您的系统已安装以下软件：

- **操作系统**：Windows 10 或更高版本、macOS 10.15 或更高版本
- **Node.js**：版本 ≥ 16.x（[手动安装](https://nodejs.org/dist/latest-v20.x/) 或使用 [nvm](https://github.com/nvm-sh/nvm) 进行版本管理）
- **npm**：版本 ≥ 6.x（随 Node.js 一起安装）
- **Git**：用于代码版本控制

同时，您需要确保已经[部署](https://docs.openim.io/zh-Hans/guides/gettingStarted/dockerCompose)了最新版本的 OpenIM Server。接下来，您可以编译项目并连接自己的服务端进行测试。

## 运行环境

本应用支持以下浏览器和操作系统版本：

| 浏览器/操作系统 | 版本              | 状态 |
| --------------- | ----------------- | ---- |
| **Chrome**      | 78 及以上         | ✅   |
| **Windows**     | Windows 10 及以上 | ✅   |
| **macOS**       | 10.15 及以上      | ✅   |
| **Linux**       | 18.04 及以上      | ✅   |

### 说明

- **Chrome**：推荐使用最新版本以获得最佳体验。
- **操作系统**：确保您的系统版本符合要求，以避免兼容性问题。

## 快速开始

按照以下步骤设置本地开发环境：

1. 拉取代码

   ```bash
   git clone https://github.com/openimsdk/openim-electron-demo.git
   cd openim-electron-demo
   ```

2. 安装依赖

   ```bash
   npm install
   ```

3. 修改配置

   - `.env`

     > 如果没有修改过服务端默认端口，则只需要修改`VITE_BASE_HOST`为您的服务器 ip 即可，如需配置域名和 https 访问，可以参考[nginx 配置](https://docs.openim.io/zh-Hans/guides/gettingStarted/nginxDomainConfig)，并采用最下方的配置项，并修改`VITE_BASE_DOMAIN`为您的域名。

     ```bash
     VITE_BASE_HOST=your-server-ip

     VITE_WS_URL=ws://$VITE_BASE_HOST:10001
     VITE_API_URL=http://$VITE_BASE_HOST:10002
     VITE_CHAT_URL=http://$VITE_BASE_HOST:10008

     # VITE_BASE_DOMAIN=your-server-domain

     # VITE_WS_URL=wss://$VITE_BASE_DOMAIN/msg_gateway
     # VITE_API_URL=https://$VITE_BASE_DOMAIN/api
     # VITE_CHAT_URL=https://$VITE_BASE_DOMAIN/chat
     ```

4. 运行 `npm run dev` 来启动开发服务器。访问 [http://localhost:5173](http://localhost:5173) 查看结果。默认情况下将同时启动 Electron 应用程序。

5. 开始开发测试！ 🎉

## 音视频通话

开源版支持一对一音视频通话，并且需要先部署并配置[服务端](https://github.com/openimsdk/chat/blob/main/HOW_TO_SETUP_LIVEKIT_SERVER.md)。多人音视频通话、视频会议请联系邮箱 [contact@openim.io](mailto:contact@openim.io)

### 注意

- 如果要在 web 端进行音视频通话，只能在本地（localhost）进行调试，或者部署到 https 站点上后使用，这是因为浏览器的安全策略限制。

## 构建 🚀

> 该项目允许分别构建 Web 应用程序和 Electron 应用程序，但在构建过程中会有一些差异。

### Web 应用程序

1. 运行以下命令来构建 Web 应用程序：
   ```bash
   npm run build
   ```
2. 构建结果将位于 `dist` 目录。

### Electron 应用程序

1. 使用 `package_electron.json` 替换 `package.json` 文件的内容，只保留 Electron 运行所需的依赖项，这将显著减小包的大小。同时，修改打包脚本。

2. 在对应系统下运行以下命令之一来构建 Electron 应用程序：

   > 如果需要交叉编译，仅支持在 mac 环境下打包其他系统安装包，windows 或 linux 下仅支持打包对应系统安装包。

   - macOS:
     ```bash
     npm run build:mac
     ```
   - Windows:
     ```bash
     npm run build:win
     ```
   - Linux:

     ```bash
     npm run build:linux
     ```

3. 构建结果将位于 `release` 目录下。

## 功能列表

### 说明

| 功能模块           | 功能项                                                    | 状态 |
| ------------------ | --------------------------------------------------------- | ---- |
| **账号功能**       | 手机号注册\邮箱注册\验证码登录                            | ✅   |
|                    | 个人信息查看\修改                                         | ✅   |
|                    | 多语言设置                                                | ✅   |
|                    | 修改密码\忘记密码                                         | ✅   |
| **好友功能**       | 查找\申请\搜索\添加\删除好友                              | ✅   |
|                    | 同意\拒绝好友申请                                         | ✅   |
|                    | 好友备注                                                  | ✅   |
|                    | 是否允许添加好友                                          | ✅   |
|                    | 好友列表\好友资料实时同步                                 | ✅   |
| **黑名单功能**     | 限制消息                                                  | ✅   |
|                    | 黑名单列表实时同步                                        | ✅   |
|                    | 添加\移出黑名单                                           | ✅   |
| **群组功能**       | 创建\解散群组                                             | ✅   |
|                    | 申请加群\邀请加群\退出群组\移除群成员                     | ✅   |
|                    | 群名/群头像更改/群资料变更通知和实时同步                  | ✅   |
|                    | 群成员邀请进群                                            | ✅   |
|                    | 群主转让                                                  | ✅   |
|                    | 群主、管理员同意进群申请                                  | ✅   |
|                    | 搜索群成员                                                | ✅   |
| **消息功能**       | 离线消息                                                  | ✅   |
|                    | 漫游消息                                                  | ✅   |
|                    | 多端消息                                                  | ✅   |
|                    | 历史消息                                                  | ✅   |
|                    | 消息删除                                                  | ✅   |
|                    | 消息清空                                                  | ✅   |
|                    | 消息复制                                                  | ✅   |
|                    | 单聊正在输入                                              | ✅   |
|                    | 新消息勿扰                                                | ✅   |
|                    | 清空聊天记录                                              | ✅   |
|                    | 新成员查看群聊历史消息                                    | ✅   |
|                    | 新消息提示                                                | ✅   |
|                    | 文本消息                                                  | ✅   |
|                    | 图片消息                                                  | ✅   |
|                    | 视频消息                                                  | ✅   |
|                    | 表情消息                                                  | ✅   |
|                    | 文件消息                                                  | ✅   |
|                    | 语音消息                                                  | ✅   |
|                    | 名片消息                                                  | ✅   |
|                    | 地理位置消息                                              | ✅   |
|                    | 自定义消息                                                | ✅   |
| **会话功能**       | 置顶会话                                                  | ✅   |
|                    | 会话已读                                                  | ✅   |
|                    | 会话免打扰                                                | ✅   |
| **REST API**       | 认证管理                                                  | ✅   |
|                    | 用户管理                                                  | ✅   |
|                    | 关系链管理                                                | ✅   |
|                    | 群组管理                                                  | ✅   |
|                    | 会话管理                                                  | ✅   |
|                    | 消息管理                                                  | ✅   |
| **Webhook**        | 群组回调                                                  | ✅   |
|                    | 消息回调                                                  | ✅   |
|                    | 推送回调                                                  | ✅   |
|                    | 关系链回调                                                | ✅   |
|                    | 用户回调                                                  | ✅   |
| **容量和性能**     | 1 万好友                                                  | ✅   |
|                    | 10 万人大群                                               | ✅   |
|                    | 秒级同步                                                  | ✅   |
|                    | 集群部署                                                  | ✅   |
|                    | 互踢策略                                                  | ✅   |
| **在线状态**       | 所有平台不互踢                                            | ✅   |
|                    | 每个平台各只能登录一个设备                                | ✅   |
|                    | PC 端、移动端、Pad 端、Web 端、小程序端各只能登录一个设备 | ✅   |
|                    | PC 端不互踢，其他平台总计一个设备                         | ✅   |
| **音视频通话**     | 一对一音视频通话                                          | ✅   |
| **文件类对象存储** | 支持私有化部署 minio                                      | ✅   |
|                    | 支持 COS、OSS、Kodo、S3 公有云                            | ✅   |
| **推送**           | 消息在线实时推送                                          | ✅   |
|                    | 消息离线推送，支持个推，Firebase                          | ✅   |

更多高级功能、音视频通话、视频会议 请联系邮箱 [contact@openim.io](mailto:contact@openim.io)

## 加入社区 :busts_in_silhouette:

- 🚀 [加入我们的 Slack 社区](https://join.slack.com/t/openimsdk/shared_invite/zt-22720d66b-o_FvKxMTGXtcnnnHiMqe9Q)
- :eyes: [加入我们的微信群](https://openim-1253691595.cos.ap-nanjing.myqcloud.com/WechatIMG20.jpeg)

## 常见问题

1. 发布 web 端时，wasm 加载太慢如何解决？

   答：针对 wasm 文件采用 gzip 压缩，压缩后会大大减小体积。同时可以做 cdn 加速，加快加载速度。

2. CKEditorError: ckeditor-duplicated-modules

答：依赖冲突，执行`npm dedupe`整理依赖
