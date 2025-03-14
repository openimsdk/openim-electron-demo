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
            click: () => {
              global.forceQuit = true;
              app.quit();
            },
          },
        ],
      },
      {
        label: t("system.fastKeys"),
        submenu: [
          { label: t("system.copy"), role: "copy", accelerator: "CmdOrCtrl+C" },
          { label: t("system.paste"), role: "paste", accelerator: "CmdOrCtrl+V" },
          { label: t("system.cut"), role: "cut", accelerator: "CmdOrCtrl+X" },
          { label: t("system.undo"), role: "undo", accelerator: "CmdOrCtrl+Z" },
          { label: t("system.redo"), role: "redo", accelerator: "CmdOrCtrl+Y" },
          {
            label: t("system.selectAll"),
            role: "selectAll",
            accelerator: "CmdOrCtrl+A",
          },
        ],
      },
      {
        label: t("system.window"),
        role: "window",
        submenu: [
          { label: t("system.minimize"), role: "minimize", accelerator: "CmdOrCtrl+W" },
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
