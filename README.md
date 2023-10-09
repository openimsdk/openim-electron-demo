# OpenIM Electron Demo 💬💻

<p>
  <a href="https://doc.rentsoft.cn/">OpenIM Docs</a>
  •
  <a href="https://github.com/openimsdk/open-im-server">OpenIM Server</a>
  •
  <a href="https://github.com/openimsdk/open-im-sdk-web-wasm">openim-sdk-wasm</a>
  •
  <a href="https://github.com/openimsdk/openim-sdk-core">openim-sdk-core</a>
</p>

<br>

OpenIM Electron Demo is an open-source instant messaging application built on OpenIM SDK Wasm, OpenIM Server, and Electron. It demonstrates how to quickly integrate instant messaging capabilities into any web app using OpenIM.

## Tech Stack 🛠️

- This is a [`Electron`](https://www.electronjs.org/) project bootstrapped with [`Vite`](https://vitejs.dev/).
- App is built with [openim-sdk-wasm](https://github.com/openimsdk/open-im-sdk-web-wasm) library.

## Live Demo 🌐

Give it a try at [https://web-enterprise.rentsoft.cn](https://web-enterprise.rentsoft.cn).

## Dev Setup 🛠️

> It is recommended to use version 16.x-18.x.

Follow these steps to set up a local development environment:

1. Run `npm install` to install all dependencies.
2. Modify the request address to your own OpenIM Server IP in the following files:
   - `src/utils/open_im_sdk_wasm/api/config.js`
     ```js
     export const WS_URL = "ws://your-server-ip:10001";
     export const API_URL = "http://your-server-ip:10002";
     export const USER_URL = "http://your-server-ip:10008";
     ```
3. Run `npm run dev` to start the development server. Visit [http://localhost:5174](http://localhost:5174) to see the result. An Electron application will be launched by default.
4. Start development! 🎉

## Build 🚀

> This project allows building web applications and Electron applications separately, but there will be some differences during the build process.

### Web Application

1. Replace the contents of the `package_build_web.json` file with `package.json`, removing dependencies required for Electron to run. Also, modify the build script.
2. Run the following command to build the web application:
   ````bash
   npm run build
   ```
   ````
3. The build result will be located in the `dist` folder.

### Electron Application

1. Replace the contents of the `package_build.json` file with `package.json`, keeping only the dependencies required for Electron to function. This significantly reduces the package size. Also, modify the packaging script.
2. Update the path for wasm import in the `utils/open_im_sdk_wasm/api/database/instance.js` file:
   ````javascript
   - SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' });
   + SQL = await initSqlJs({ locateFile: () => '../sql-wasm.wasm' });
   ```
   ````
3. Run one of the following commands to build the Electron application:
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
4. The build result will be located in the `package` folder.
