import { app } from "electron";

export const isLinux = process.platform == "linux";
export const isWin = process.platform == "win32";
export const isMac = process.platform == "darwin";
export const isProd = app.isPackaged;
