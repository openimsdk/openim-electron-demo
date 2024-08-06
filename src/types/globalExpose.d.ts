import { Platform } from "@openim/wasm-client-sdk";

export type DataPath = "public";

export interface IElectronAPI {
  getDataPath: (key: DataPath) => string;
  getVersion: () => string;
  getPlatform: () => Platform;
  getSystemVersion: () => string;
  subscribe: (channel: string, callback: (...args: any[]) => void) => () => void;
  subscribeOnce: (channel: string, callback: (...args: any[]) => void) => void;
  unsubscribeAll: (channel: string) => void;
  ipcInvoke: <T = unknown>(channel: string, ...arg: any) => Promise<T>;
  ipcSendSync: <T = unknown>(channel: string, ...arg: any) => T;
  saveFileToDisk: (params: {
    file: File;
    type: "fileCache" | "sentFileCache";
    sync?: boolean;
  }) => Promise<string>;
}

declare global {
  interface Window {
    electronAPI?: IElectronAPI;
    userClick: (userID?: string, isSelf?: boolean) => void;
  }
}

declare module "i18next" {
  interface TFunction {
    (key: string, options?: object): string;
  }
}
