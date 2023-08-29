<img src="https://github.com/OpenIMSDK/OpenIM-Docs/blob/main/docs/images/WechatIMG20.jpeg" alt="image" style="width: 350px; " />

## 快速开始

### 开发环境

> 建议使用 node14.x-16.x 版本，npm7.x+版本。

### 配置修改

- 修改 IM 连接地址
  > src->config
  > 修改为你自己的 ip 即可，端口不必修改。

```bash
export const WS_URL = "ws://14.29.213.197:10001";
export const API_URL = "http://14.29.213.197:10002";
export const USER_URL = "http://14.29.213.197:10008";
```

### 开发

- 通过 npm 获取项目依赖

  ```bash
  npm install
  ```

- 本地调试运行（同时启动 web 和 pc 端）

  ```
  npm run dev

  ```

- 打包 (web)

  > 你可以将`package_build_web.json`中的内容替换到`package.json`文件中,移除了部分 pc 相关的依赖。

  ```
  npm run build
  ```

- 打包 (electron)

  > 你可以将`package_build.json`中的内容替换到`package.json`文件中,仅保留 pc 运行需要用到的依赖，减少包体积。

  > 你需要修改`utils/open_im_sdk_wasm/api/database/instance.js`中 wasm 文件的引入路径。
  >
  > ```javascript
  > - SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' });
  > + SQL = await initSqlJs({ locateFile: () => '../sql-wasm.wasm' });
  > ```

  ```bash
  npm run el:build
  // or
  npm run el:build-win
  // or
  npm run el:build-linux
  ```

## 获取帮助

与我们团队交流的最佳方式是通过 GitHub。您可以通过此问题提出问题。您还可以在[开发者中心](https://doc.rentsoft.cn/) 中找到一些文档。
