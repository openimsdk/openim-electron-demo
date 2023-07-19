![avatar](https://openim-1253691595.cos.ap-nanjing.myqcloud.com/WechatIMG20.jpeg)

## Getting Started

### Update Config

- For web
  > src->config
  > modify it to your own ip, but do not need to modify the port

```bash
export const WS_URL = "ws://125.124.195.201:10001";
export const API_URL = "http://125.124.195.201:10002";
export const USER_URL = "http://125.124.195.201:10008";
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
  npm run el:build
  // or
  npm run el:build-win
  // or
  npm run el:build-linux
  ```

## Getting Help

The best way to interact with our team is through GitHub.You can open an issue with this.You can also find some Doc in [Our Developer Guide](https://doc.rentsoft.cn/).
