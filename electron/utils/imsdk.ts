import path from "path";
import os from "os";
import OpenIMSDKMain from "@openim/electron-client-sdk";
import { WebContents } from "electron";

export const getLibSuffix = () => {
  const platform = process.platform;
  const arch = os.arch();
  if (platform === "darwin") {
    return path.join(`mac_${arch === "arm64" ? "arm64" : "x64"}`, "libopenimsdk.dylib");
  }
  if (platform === "win32") {
    return path.join(`win_${arch === "ia32" ? "ia32" : "x64"}`, "libopenimsdk.dll");
  }
  return path.join(`linux_${arch === "arm64" ? "arm64" : "x64"}`, "libopenimsdk.so");
};

export const initIMSDK = (webContents: WebContents) =>
  new OpenIMSDKMain(
    path.join(global.pathConfig.imsdkLibPath, getLibSuffix()),
    webContents,
  );
