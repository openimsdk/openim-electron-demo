import { existsSync } from "original-fs";
import { IElectronAPI } from "./../../src/types/globalExpose.d";
import { contextBridge, ipcRenderer, shell } from "electron";

const getPlatform = () => {
  if (process.platform === "darwin") {
    return 4;
  }
  if (process.platform === "win32") {
    return 3;
  }
  return 7;
};

const subscribe = (channel: string, callback: (...args: any[]) => void) => {
  ipcRenderer.on(channel, callback);
};

const subscribeOnce = (channel: string, callback: (...args: any[]) => void) => {
  ipcRenderer.once(channel, callback);
};

const unsubscribe = (channel: string, callback: (...args: any[]) => void) => {
  ipcRenderer.removeListener(channel, callback);
};

const unsubscribeAll = (channel: string) => {
  ipcRenderer.removeAllListeners(channel);
};

const ipcInvoke = (channel: string, ...arg: any) => {
  return ipcRenderer.invoke(channel, ...arg);
};

const Api: IElectronAPI = {
  getVersion: () => process.version,
  getPlatform,
  subscribe,
  subscribeOnce,
  unsubscribe,
  unsubscribeAll,
  ipcInvoke,
};

contextBridge.exposeInMainWorld("electronAPI", Api);
