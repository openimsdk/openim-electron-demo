import { app, Menu } from "electron";
import { isMac } from "../utils";

const createAppMenu = () => {
  if (isMac) {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: app.getName(),
        submenu: [
          { label: "关于", role: "about" },
          { type: "separator" },
          { label: "隐藏", role: "hide" },
          { type: "separator" },
          {
            label: "退出",
            accelerator: "Command+Q",
            click: () => {
              global.forceQuit = true;
              app.quit();
            },
          },
        ],
      },
      {
        label: "窗口",
        role: "window",
        submenu: [
          { label: "最小化", role: "minimize", accelerator: "Command+W" },
          { label: "关闭", role: "close" },
        ],
      },
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  } else {
    Menu.setApplicationMenu(null);
  }
};

export default createAppMenu;
