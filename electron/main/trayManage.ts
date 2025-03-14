import { app, Menu, Tray } from "electron";
import { t } from "i18next";
import { hideWindow, showWindow } from "./windowManage";

let appTray: Tray;

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
      label: t("system.toggleDevTools"),
      role: "toggleDevTools",
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
  appTray.on("click", showWindow);

  appTray.setContextMenu(trayMenu);
};

export const destroyTray = () => {
  if (!appTray || appTray.isDestroyed()) return;
  appTray.destroy();
  appTray = null;
};
