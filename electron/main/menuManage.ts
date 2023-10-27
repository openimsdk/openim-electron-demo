import { app, Menu } from "electron";
import { t } from "i18next";
import { isMac } from "../utils";

const createAppMenu = () => {
  if (isMac) {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: app.getName(),
        submenu: [
          { label: t("system.about"), role: "about" },
          { type: "separator" },
          { label: t("system.hide"), role: "hide" },
          { type: "separator" },
          {
            label: t("system.quit"),
            accelerator: "Command+Q",
            click: () => {
              global.forceQuit = true;
              app.quit();
            },
          },
        ],
      },
      {
        label: t("system.window"),
        role: "window",
        submenu: [
          { label: t("system.minimize"), role: "minimize" },
          { label: t("system.close"), role: "close" },
        ],
      },
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  } else {
    Menu.setApplicationMenu(null);
  }
};

export default createAppMenu;
