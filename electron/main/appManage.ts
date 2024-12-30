import { app, powerMonitor } from "electron";
import { isExistMainWindow, sendEvent, showWindow } from "./windowManage";
import { join } from "node:path";
import fs from "fs";
import { isMac, isProd, isWin } from "../utils";
import { getStore } from "./storeManage";
import { IpcMainToRender } from "../constants";
import { logger } from ".";

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

  powerMonitor.on("suspend", () => {
    logger.debug("app suspend");
  });

  powerMonitor.on("resume", () => {
    logger.debug("app resume");
    sendEvent(IpcMainToRender.appResume);
  });
};

export const setAppGlobalData = () => {
  const electronDistPath = join(__dirname, "../");
  const distPath = join(electronDistPath, "../dist");
  const publicPath = isProd ? distPath : join(electronDistPath, "../public");
  const asarPath = process.resourcesPath;

  global.pathConfig = {
    electronDistPath,
    distPath,
    publicPath,
    asarPath,
    logsPath: join(app.getPath("userData"), `/OpenIMData/logs`),
    sdkResourcesPath: join(app.getPath("userData"), `/OpenIMData/sdkResources`),
    imsdkLibPath: isProd
      ? join(
          asarPath,
          "/app.asar.unpacked/node_modules/@openim/electron-client-sdk/assets",
        )
      : join(__dirname, "../../node_modules/@openim/electron-client-sdk/assets"),
    trayIcon: join(publicPath, `/icons/${isWin ? "icon.ico" : "tray.png"}`),
    emptyTrayIcon: join(publicPath, `/icons/${"empty_tray.png"}`),
    indexHtml: join(distPath, "index.html"),
    splashHtml: join(distPath, "splash.html"),
    preload: join(__dirname, "../preload/index.js"),
  };

  if (isProd) {
    fs.promises
      .readdir(global.pathConfig.logsPath)
      .catch(
        (err) =>
          err.code === "ENOENT" &&
          fs.promises.mkdir(global.pathConfig.logsPath, { recursive: true }),
      );
    fs.promises
      .readdir(global.pathConfig.sdkResourcesPath)
      .catch(
        (err) =>
          err.code === "ENOENT" &&
          fs.promises.mkdir(global.pathConfig.sdkResourcesPath, { recursive: true }),
      );
  }
};

export const getIsForceQuit = () =>
  store.get("closeAction") === "quit" || global.forceQuit;
