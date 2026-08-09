import { Platform } from "@openim/wasm-client-sdk";

export type DataPath = "public" | "emojiData" | "sdkResources" | "logsPath";

export interface IElectronAPI {
  getDataPath: (key: DataPath) => string;
  getVersion: () => string;
  getPlatform: () => Platform;
  getSystemVersion: () => string;
  subscribe: (channel: string, callback: (...args: unknown[]) => void) => () => void;
  subscribeOnce: (channel: string, callback: (...args: unknown[]) => void) => void;
  unsubscribeAll: (channel: string) => void;
  ipcInvoke: <T = unknown>(channel: string, ...args: unknown[]) => Promise<T>;
  ipcSendSync: <T = unknown>(channel: string, ...args: unknown[]) => T;
  saveFileToDisk: (params: { file: File; sync?: boolean }) => Promise<string>;
  getFileByPath: (filePath: string) => Promise<File | null>;
}

declare global {
  interface Window {
    electronAPI?: IElectronAPI;
    userClick: (userID?: string, groupID?: string) => void;
    editRevoke: (clientMsgID: string) => void;
    screenshotPreview: (results: string) => void;
  }
}

declare module "i18next" {
  interface TFunction {
    (key: string, options?: object): string;
  }
}
