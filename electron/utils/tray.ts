import { app, BrowserWindow, Menu, Tray } from "electron";
import * as path from "path";
import { getAppCloseAction } from "../store";
import * as isDev from "electron-is-dev";

let appTray: Tray;
let timer: NodeJS.Timeout | null = null;
const emptyPic = path.join(__dirname, isDev?"../../../public/icons/empty_tray.png":"../../icons/empty_tray.png");
const trayPic = path.join(__dirname, isDev? "../../../public/icons/tray.png":"../../icons/tray.png");

export const setTray = (win: BrowserWindow|null) => {
  const trayMenu = Menu.buildFromTemplate([
    {
      label: "退出",
      click: () => {
        app.quit();
      },
    },
  ]);
  appTray = new Tray(trayPic);
  appTray.setToolTip("OpenIM");

  appTray.setContextMenu(trayMenu);

  appTray.on("click", function () {
    win?.show();
    win?.focus();
  });

  appTray.on("double-click", function () {
    win?.show();
  });

  win?.on("close",(e)=>{
    if(!win?.isVisible()||getAppCloseAction()){
			win = null;
      appTray.destroy();
		}else{
			e.preventDefault();
      win?.hide()
			// win?.minimize();
		}
  })
};

export const flickerTray = () => {
  let count = 0;
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    count++;
    if (count % 2 == 0) {
      appTray.setImage(emptyPic);
    } else {
      appTray.setImage(trayPic);
    }
  }, 500);
};

export const setTrayTitle = (num:number) => {
  appTray.setTitle(num===0?"":num+'')
}