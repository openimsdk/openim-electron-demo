import { Platform } from "open-im-sdk-wasm";

export interface IElectronAPI {
  getVersion: () => string;
  getPlatform: () => Platform;
  subscribe: (channel: string, callback: (...args: any[]) => void) => void;
  subscribeOnce: (channel: string, callback: (...args: any[]) => void) => void;
  unsubscribe: (channel: string, callback: (...args: any[]) => void) => void;
  unsubscribeAll: (channel: string) => void;
  ipcInvoke: <T = unknown>(channel: string, ...arg: any) => Promise<T>;
  ipcSendSync: <T = unknown>(channel: string, ...arg: any) => T;
}

declare global {
  interface Window {
    electronAPI?: IElectronAPI;
    userClick: (userID: string, groupID: string) => void;
  }
}

declare module "i18next" {
  interface TFunction {
    (key: string, options?: object): string;
  }
}
