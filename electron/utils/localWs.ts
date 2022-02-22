import { app } from "electron";
import * as fs from "fs";
import * as isDev from "electron-is-dev";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { platform } from "process";
import { getApiAddress, getAppStatus, getWsAddress, getWsPort } from "../store";

const appPath = app.getAppPath();
const userDataPath = app.getPath("userData");
const dbDataPath = `${userDataPath}/db`;

let localWs:ChildProcessWithoutNullStreams;

const checkDir = () => {
  return new Promise<void>((resolve, reject) => {
    fs.access(dbDataPath, (err) => {
      if (err && err.code == "ENOENT") {
        fs.mkdir(dbDataPath, () => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  });
};

export const initLocalWs = async () => {
  await checkDir();
  let exeType = "";
  if (platform === "darwin") {
    exeType = "localWs_mac";
  } else if (platform === "win32") {
    exeType = "localWs_win.exe";
  }
  const exPath = isDev ? `${__dirname}/../../../electron/exec/${exeType}` : `${appPath}/../exec/${exeType}`;
  const dbDir = isDev ? "./" : dbDataPath;
  
  localWs = spawn(exPath, ["-openIMApiAddress", getApiAddress(), "-openIMWsAddress", getWsAddress(), "-sdkWsPort", getWsPort(), "-openIMDbDir", dbDir]);

  localWs.stdout.on("data", (data: Buffer) => {
    console.log("stdout:::::");
    console.log(data.toString());
  });
  localWs.stderr.on("data", (data: Buffer) => {
    console.log("stderr:::::");
    console.log(data.toString());
  });
  localWs.on("close", (code: number) => {
    console.log("close:::::");
    setTimeout(() => {
      if(getAppStatus()){
        localWs = spawn(exPath, ["-openIMApiAddress", getApiAddress(), "-openIMWsAddress", getWsAddress(), "-sdkWsPort", getWsPort(), "-openIMDbDir", dbDir]);
      }
    }, 2000);
  });
};

export const killLocalWs = () => {
  
  if(localWs&&!localWs.killed){
    localWs.kill();
  }
}
