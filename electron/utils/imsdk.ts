import path from "path";
import os from "os";
import OpenIMSDKMain from "@openim/electron-client-sdk";
import { WebContents } from "electron";

export const getLibSuffix = () => {
  const platform = process.platform;
  const arch = os.arch();
  if (platform === "darwin" && (arch === "x64" || arch === "arm64")) {
    return path.join(`mac_${arch}`, "libopenimsdk.dylib");
  }
  if (platform === "win32" && arch === "x64") {
    return path.join("win_x64", "libopenimsdk.dll");
  }
  if (platform === "linux" && (arch === "x64" || arch === "arm64")) {
    return path.join(`linux_${arch}`, "libopenimsdk.so");
  }
  throw new Error(`Unsupported OpenIM SDK platform: ${platform}/${arch}`);
};

export const initIMSDK = (webContents: WebContents) =>
  new OpenIMSDKMain(
    path.join(global.pathConfig.imsdkLibPath, getLibSuffix()),
    webContents,
  );
