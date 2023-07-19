import log from "./log";

export const isLinux = process.platform == "linux";
export const isWin = process.platform == "win32";
export const isMac = process.platform == "darwin";
export const isProd = !process.env.VITE_DEV_SERVER_URL;

export { log };
