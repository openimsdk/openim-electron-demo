import { app } from "electron";
import { createMainWindow } from "./windowManage";
import { createTray } from "./trayManage";
import { setIpcMainListener } from "./ipcHandlerManage";
import {
  performAppStartup,
  setAppGlobalData,
  setAppListener,
  setSingleInstance,
} from "./appManage";
import createAppMenu from "./menuManage";
import { isLinux } from "../utils";
import { initI18n } from "../i18n";

const init = () => {
  initI18n();
  createMainWindow();
  createAppMenu();
  createTray();
};

setAppGlobalData();
performAppStartup();
setIpcMainListener();
setSingleInstance();
setAppListener(init);

app.whenReady().then(() => {
  isLinux ? setTimeout(init, 300) : init();
});
