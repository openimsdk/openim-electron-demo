const { contextBridge } = require('electron')
import { ipcRenderer } from 'electron';
import { networkInterfaces } from 'os';
import { platform } from 'process';
import type { API, APIKey } from '../../src/@types/api';
import { getAppCloseAction, getWsPort, setAppCloseAction } from '../store';

export const apiKey:APIKey = 'electron';

const isMac = platform === "darwin"

let listeners:any = {};

const getPlatform = () => {
    switch (platform) {
      case "darwin":
        return 4;
      case "win32":
        return 3;
      case "linux":
        return 7;
      default:
        return 5;
    }
  };

const getLocalWsAddress = () => {
    let ips = [];
    const intf = networkInterfaces();
    for (let devName in intf) {
        let iface = intf[devName];
        console.log(iface);

        for (let i = 0; i < iface!.length; i++) {
        let alias = iface![i];
        if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal) {
            ips.push(alias.address);
        }
        }
    }
    return `ws://${ips[0]}:${getWsPort()}`;
}

const getIMConfig = () => {
    return ipcRenderer.sendSync("GetIMConfig")
}

const setIMConfig = (config:any) => {
    ipcRenderer.send("SetIMConfig",config)
}

const focusHomePage = () => {
    ipcRenderer.send("FocusHomePage")
}

const unReadChange = (num:number) => {
    ipcRenderer.send("UnReadChange",num)
}

const miniSizeApp = () => {
    ipcRenderer.send("MiniSizeApp")
}

const maxSizeApp = () => {
    ipcRenderer.send("MaxSizeApp")
}

const closeApp = () => {
    ipcRenderer.send("CloseApp")
}

const addIpcRendererListener = (event:string, listener:(...args:any[]) => void, flag:string) => {
    listeners[flag] = {event,listener}
    ipcRenderer.addListener(event,listener)
}

const removeIpcRendererListener = (flag:string) => {
    ipcRenderer.removeListener(listeners[flag].event,listeners[flag].listener);
    delete listeners[flag]
}

const screenshot = () => {
    ipcRenderer.send("Screenshot")
}

export const api:API = {
    platform: getPlatform(),
    isMac,
    getLocalWsAddress,
    getIMConfig,
    setIMConfig,
    focusHomePage,
    unReadChange,
    miniSizeApp,
    maxSizeApp,
    closeApp,
    getAppCloseAction,
    setAppCloseAction,
    addIpcRendererListener,
    removeIpcRendererListener,
    screenshot
};


contextBridge.exposeInMainWorld(apiKey,api);
