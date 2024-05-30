import { app, shell } from "electron";
import { isExistMainWindow, showWindow } from "./windowManage";
import { join } from "node:path";
import { release } from "node:os";
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
  app.on("web-contents-created", (event, contents) => {
    contents.setWindowOpenHandler(({ url }) => {
      if (!/^devtools/.test(url) && /^https?:\/\//.test(url)) {
        shell.openExternal(url);
      }
      return { action: "deny" };
    });
  });

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

export const performAppStartup = () => {
  app.setAppUserModelId(app.getName());

  app.commandLine.appendSwitch("--autoplay-policy", "no-user-gesture-required");
  app.commandLine.appendSwitch(
    "disable-features",
    "HardwareMediaKeyHandling,MediaSessionService",
  );

  // Disable GPU Acceleration for Windows 7
  if (release().startsWith("6.1")) app.disableHardwareAcceleration();
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
    asarPath,
    trayIcon: join(publicPath, `/icons/${isWin ? "icon.ico" : "tray.png"}`),
    indexHtml: join(distPath, "index.html"),
    splashHtml: join(distPath, "splash.html"),
    preload: join(__dirname, "../preload/index.js"),
  };
};

export const getIsForceQuit = () =>
  store.get("closeAction") === "quit" || global.forceQuit;
