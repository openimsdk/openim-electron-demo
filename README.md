<img src="https://github.com/OpenIMSDK/OpenIM-Docs/blob/main/docs/images/WechatIMG20.jpeg" alt="image" style="width: 350px; " />

## Getting Started

### Environment

> It is recommended to use node14.x-16.x version, npm7.x+ version

### Update Config

- For web
  > src->config
  > modify it to your own ip, but do not need to modify the port

```bash
export const WS_URL = "ws://14.29.213.197:10001";
export const API_URL = "http://14.29.213.197:10002";
export const USER_URL = "http://14.29.213.197:10008";
```

### Develop

- Get dependencies from npm

  ```bash
  npm install
  ```

- Run and preview at local (web & electron)

  ```
  npm run dev

  ```

- Build (web)

  > You can refer to the dependencies in the `package_build_web.json` file to reduce the size of the installation package

  ```
  npm run build
  ```

- Build (electron)

  > You can refer to the dependencies in the `package_build.json` file to reduce the size of the installation package

  > you need update `utils/open_im_sdk_wasm/api/database/instance.js` wasm import path first.
  >
  > ```javascript
  > - SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' });
  > + SQL = await initSqlJs({ locateFile: () => '../sql-wasm.wasm' });
  > ```

  ```bash
  npm run build:mac
  // or
  npm run build:win
  // or
  npm run build:linux
  ```

## Getting Help

The best way to interact with our team is through GitHub.You can open an issue with this.You can also find some Doc in [Our Developer Guide](https://doc.rentsoft.cn/).
