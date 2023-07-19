import { ipcMain } from "electron";
import { closeWindow, minimize, updateMaximize } from "./windowManage";
import { IpcRenderToMain } from "../constants";
import { getStore } from "./storeManage";

const store = getStore();

export const setIpcMainListener = () => {
  // window manage
  ipcMain.handle(IpcRenderToMain.minimizeWindow, () => {
    minimize();
  });
  ipcMain.handle(IpcRenderToMain.maxmizeWindow, () => {
    updateMaximize();
  });
  ipcMain.handle(IpcRenderToMain.closeWindow, () => {
    closeWindow();
  });

  // data transfer
  ipcMain.handle(IpcRenderToMain.setKeyStore, (_, { key, data }) => {
    store.set(key, data);
  });
  ipcMain.handle(IpcRenderToMain.getKeyStore, (e, { key }) => {
    return store.get(key);
  });
};
