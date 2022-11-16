const Store = require("electron-store");

const store = new Store();

export const setAppStatus = (status: boolean) => store.set("AppStatus",status);
export const setAppCloseAction = (close: boolean) => store.set("AppCloseAction",close);

export const getAppStatus = () => store.get("AppStatus") ?? true;
export const getAppCloseAction = () => store.get("AppCloseAction") ?? false;
