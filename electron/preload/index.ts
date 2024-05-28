import fs from "fs";
import path from "path";
import { contextBridge, ipcRenderer } from "electron";
import { IElectronAPI } from "./../../src/types/globalExpose.d";

import "@openim/electron-client-sdk/lib/preload";

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

const ipcSendSync = (channel: string, ...arg: any) => {
  return ipcRenderer.sendSync(channel, ...arg);
};

const saveFileToDisk = async ({
  file,
  sync,
}: {
  file: File;
  sync?: boolean;
}): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const saveDir = await ipcInvoke("getUserDataPath");
  const savePath = path.join(saveDir, file.name);
  if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir, { recursive: true });
  }
  if (sync) {
    await fs.promises.writeFile(savePath, Buffer.from(arrayBuffer));
  } else {
    fs.promises.writeFile(savePath, Buffer.from(arrayBuffer));
  }
  return savePath;
};

const Api: IElectronAPI = {
  getVersion: () => process.version,
  getPlatform,
  subscribe,
  subscribeOnce,
  unsubscribe,
  unsubscribeAll,
  ipcInvoke,
  ipcSendSync,
  saveFileToDisk,
};

contextBridge.exposeInMainWorld("electronAPI", Api);
