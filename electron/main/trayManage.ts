import { app, Menu, Tray } from "electron";
import { t } from "i18next";
import { hideWindow, showWindow } from "./windowManage";

let appTray: Tray;
let timer: NodeJS.Timeout | null = null;

export const createTray = () => {
  const trayMenu = Menu.buildFromTemplate([
    {
      label: t("system.showWindow"),
      click: showWindow,
    },
    {
      label: t("system.hideWindow"),
      click: hideWindow,
    },
    {
      label: t("system.about"),
      role: "about",
    },
    {
      label: t("system.quit"),
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
