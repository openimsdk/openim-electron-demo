import { app, Menu, Tray } from "electron";
import { hideWindow, showWindow } from "./windowManage";

let appTray: Tray;
let timer: NodeJS.Timeout | null = null;

export const createTray = () => {
  const trayMenu = Menu.buildFromTemplate([
    {
      label: "显示主界面",
      click: showWindow,
    },
    {
      label: "隐藏主界面",
      click: hideWindow,
    },
    {
      label: "关于",
      role: "about",
    },
    {
      label: "退出",
      click: () => {
        global.forceQuit = true;
        app.quit();
      },
    },
  ]);
  appTray = new Tray(global.pathConfig.trayIcon);
  appTray.setToolTip(app.getName());
  appTray.setIgnoreDoubleClickEvents(true);

  appTray.setContextMenu(trayMenu);
};

export const destroyTray = () => {
  if (!appTray || appTray.isDestroyed()) return;
  appTray.destroy();
  appTray = null;
};
