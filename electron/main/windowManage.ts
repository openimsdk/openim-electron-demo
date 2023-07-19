import { join } from "node:path";
import { BrowserWindow, dialog } from "electron";
import { isMac } from "../utils";
import { destroyTray } from "./trayManage";
import { getStore } from "./storeManage";
import { getIsForceQuit } from "./appManage";

const url = process.env.VITE_DEV_SERVER_URL;
let mainWindow: BrowserWindow | null = null;

const store = getStore();

export function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "OpenIM",
    icon: join(global.pathConfig.publicPath, "favicon.ico"),
    frame: false,
    minWidth: 680,
    minHeight: 550,
    titleBarStyle: "hiddenInset",
    webPreferences: {
      preload: global.pathConfig.preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    // Open devTool if the app is not packaged
    mainWindow.webContents.openDevTools({
      mode: "detach",
    });
    mainWindow.loadURL(url);
  } else {
    mainWindow.loadFile(global.pathConfig.indexHtml);
  }

  mainWindow.on("close", (e) => {
    if (
      getIsForceQuit() ||
      !mainWindow.isVisible() ||
      store.get("closeAction") === "quit"
    ) {
      mainWindow = null;
      destroyTray();
    } else {
      e.preventDefault();
      if (isMac && mainWindow.isFullScreen()) {
        mainWindow.setFullScreen(false);
      }
      mainWindow?.hide();
    }
  });

  return mainWindow;
}

// utils
export const isExistMainWindow = (): boolean =>
  !!mainWindow && !mainWindow?.isDestroyed();

export const closeWindow = () => {
  if (!mainWindow) return;
  mainWindow.close();
};

export const showSelectDialog = async (options: Electron.OpenDialogOptions) => {
  if (!mainWindow) throw new Error("main window is undefined");
  return await dialog.showOpenDialog(mainWindow, options);
};
export const minimize = () => {
  if (!mainWindow) return;
  mainWindow.minimize();
};
export const updateMaximize = () => {
  if (!mainWindow) return;
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
};
export const toggleHide = () => {
  if (!mainWindow) return;
  mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
};
export const toggleMinimize = () => {
  if (!mainWindow) return;
  if (mainWindow.isMinimized()) {
    if (!mainWindow.isVisible()) {
      mainWindow.show();
    }
    mainWindow.restore();
    mainWindow.focus();
  } else {
    mainWindow.minimize();
  }
};
export const showWindow = () => {
  if (!mainWindow) return;
  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }
  if (mainWindow.isVisible()) {
    mainWindow.focus();
  } else {
    mainWindow.show();
  }
};
export const hideWindow = () => {
  if (!mainWindow) return;
  mainWindow.hide();
};
