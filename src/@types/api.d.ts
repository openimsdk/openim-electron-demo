export type APIKey = "electron";
export type API = {
  isMac: boolean;
  getLocalWsAddress: () => string;
  getIMConfig: () => any;
  setIMConfig: (config:any) => void;
  focusHomePage: () => void;
  unReadChange: (num:number) => void;
  miniSizeApp: () => void;
  maxSizeApp: () => void;
  closeApp: () => void;
  getAppCloseAction: () => boolean;
  setAppCloseAction: (close:boolean) => void;
  addIpcRendererListener: (event:string, listener:(...args:any[]) => void,flag:string) => void;
  removeIpcRendererListener: (flag:string) => void;
  screenshot: () => void;
};
