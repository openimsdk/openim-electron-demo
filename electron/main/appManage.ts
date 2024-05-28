import { app } from "electron";
import { isExistMainWindow, showWindow } from "./windowManage";
import { join } from "node:path";
import { isMac, isProd, isWin } from "../utils";
import { getStore } from "./storeManage";

const store = getStore();

export const setSingleInstance = () => {
  if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
  }

  app.on("second-instance", () => {
    showWindow();
  });
};

export const setAppListener = (startApp: () => void) => {
  app.on("activate", () => {
    if (isExistMainWindow()) {
      showWindow();
    } else {
      startApp();
    }
  });

  app.on("window-all-closed", () => {
    if (isMac && !getIsForceQuit()) return;

    app.quit();
  });
};

export const setAppGlobalData = () => {
  const electronDistPath = join(__dirname, "../");
  const distPath = join(electronDistPath, "../dist");
  const publicPath = isProd ? distPath : join(electronDistPath, "../public");
  const asarPath = join(distPath, "/../..");

  global.pathConfig = {
    electronDistPath,
    distPath,
    publicPath,
    imsdkLibPath: isProd
      ? join(
          asarPath,
          "/app.asar.unpacked/node_modules/@openim/electron-client-sdk/assets",
        )
      : join(__dirname, "../../node_modules/@openim/electron-client-sdk/assets"),
    trayIcon: join(publicPath, `/icons/${isWin ? "icon.ico" : "tray.png"}`),
    indexHtml: join(distPath, "index.html"),
    preload: join(__dirname, "../preload/index.js"),
  };
};

export const getIsForceQuit = () =>
  store.get("closeAction") === "quit" || global.forceQuit;
