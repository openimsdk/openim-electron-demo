<p align="center">
    <a href="https://www.openim.online">
        <img src="./docs/images/openim-logo.gif" width="60%" height="30%"/>
    </a>
</p>

# OpenIM Electron Demo 💬💻

<p>
  <a href="https://docs.openim.io/">OpenIM Docs</a>
  •
  <a href="https://github.com/openimsdk/open-im-server">OpenIM Server</a>
  •
  <a href="https://github.com/openimsdk/open-im-sdk-web-wasm">openim-sdk-wasm</a>
  •
  <a href="https://github.com/openimsdk/openim-sdk-core">openim-sdk-core</a>
</p>

<br>

OpenIM Electron Demo 是一个基于`openim-sdk-wasm`、`openim-server`和`Electron`构建的开源即时通讯应用程序。它演示了如何使用 OpenIM 快速的将即时通讯功能集成到任何 Web 应用程序中。

## 技术栈 🛠️

- 这是一个使用 [`Electron`](https://www.electronjs.org/) 和 [`Vite`](https://vitejs.dev/) 构建的项目。
- 应用程序使用了 [openim-sdk-wasm](https://github.com/openimsdk/open-im-sdk-web-wasm) 库构建。

## 在线演示 🌐

在 [https://web-enterprise.rentsoft.cn](https://web-enterprise.rentsoft.cn) 上体验一下。

## 开发设置 🛠️

> 建议使用 node 版本 16.x-18.x。

按照以下步骤设置本地开发环境：

1. 运行 `npm install` 来安装所有依赖项。
2. 在以下文件中将请求地址修改为您自己的 OpenIM 服务器 IP：
   > 注意：您需要先[部署](https://docs.openim.io/zh-Hans/guides/gettingStarted/dockerCompose) OpenIM 服务器，默认端口为 10001、10002、10008。
   - `src/config/index.ts`
     ```js
     export const WS_URL = "ws://your-server-ip:10001";
     export const API_URL = "http://your-server-ip:10002";
     export const USER_URL = "http://your-server-ip:10008";
     ```
3. 运行 `npm run dev` 来启动开发服务器。访问 [http://localhost:5173](http://localhost:5173) 查看结果。默认情况下将启动 Electron 应用程序。
4. 开始开发！ 🎉

## 构建 🚀

> 该项目允许分别构建 Web 应用程序和 Electron 应用程序，但在构建过程中会有一些差异。

### Web 应用程序

1. 运行以下命令来构建 Web 应用程序：
   ```bash
   npm run build
   ```
2. 构建结果将位于 `dist` 文件夹中。

### Electron 应用程序

1. 使用 `package.json` 替换 `package_electron.json` 文件的内容，只保留 Electron 运行所需的依赖项。这将显著减小包的大小。同时，修改打包脚本。
2. 运行以下命令之一来构建 Electron 应用程序：
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
3. 构建结果将位于 `package` 文件夹中。

## 社区 :busts_in_silhouette:

- 📚 [OpenIM 社区](https://github.com/OpenIMSDK/community)
- 💕 [OpenIM 兴趣小组](https://github.com/Openim-sigs)
- 🚀 [加入我们的 Slack 社区](https://join.slack.com/t/openimsdk/shared_invite/zt-22720d66b-o_FvKxMTGXtcnnnHiMqe9Q)
- :eyes: [加入我们的微信群](https://openim-1253691595.cos.ap-nanjing.myqcloud.com/WechatIMG20.jpeg)

## 社区会议 :calendar:

我们希望任何人都能参与我们的社区并贡献代码，我们提供礼品和奖励，并欢迎您每个星期四晚上加入我们。

我们的会议在 [OpenIM Slack](https://join.slack.com/t/openimsdk/shared_invite/zt-22720d66b-o_FvKxMTGXtcnnnHiMqe9Q) 🎯，然后您可以搜索 Open-IM-Server 管道加入

我们在[GitHub discussions](https://github.com/openimsdk/open-im-server/discussions/categories/meeting)中记录了每一次[双周会议](https://github.com/orgs/OpenIMSDK/discussions/categories/meeting)的内容，我们的历史会议记录以及会议的回放都可以在[Google Docs :bookmark_tabs:](https://docs.google.com/document/d/1nx8MDpuG74NASx081JcCpxPgDITNTpIIos0DS6Vr9GU/edit?usp=sharing)中找到。

## 谁在使用 OpenIM :eyes:

查看我们的[用户案例](https://github.com/OpenIMSDK/community/blob/main/ADOPTERS.md)页面，以获取正在使用改项目用户的列表。不要犹豫留下[📝 评论](https://github.com/openimsdk/open-im-server/issues/379)并分享您的使用情况。

## LICENSE :page_facing_up:

OpenIM 在 Apache 2.0 许可下发布。查看[LICENSE](https://github.com/openimsdk/open-im-server/tree/main/LICENSE)以获取完整的信息。

```

```
