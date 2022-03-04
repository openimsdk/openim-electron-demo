import { app, clipboard } from "electron";
import * as isDev from "electron-is-dev";
import { exec, execFile } from "child_process";
import { win } from "../main";

const appPath = app.getAppPath();
const clipboardParsing = () => {
  let pngs = clipboard.readImage().toPNG(); //可改变图片格式，如：toJPEG
  //@ts-ignore
  let imgData = Buffer.from(pngs, "base64");
  let imgs = "data:image/png;base64," + btoa(new Uint8Array(imgData).reduce((data, byte) => data + String.fromCharCode(byte), ""));
  win?.webContents.send("ScreenshotData",imgs)
//   let mytextarea = document.getElementById("mytextarea");
//   let screenshotImg = document.createElement("img"); //imgs 为base64格式
//   screenshotImg.src = imgs;
//   // 　　screenshotImg.style.maxHeight = "70px";
//   screenshotImg.style.maxWidth = "200px";
//   mytextarea.appendChild(screenshotImg);
};

export const screenshot = () => {
  const exPath = isDev ? `${__dirname}/../../../electron/exec/PrintScr.exe` : `${appPath}/../exec/PrintScr.exe`;

  if (process.platform == "darwin") {
    //判断当前操作系统，"darwin" 是mac系统     "win32" 是window系统
    exec(`screencapture -i -c`, (error, stdout, stderr) => {
      if (!error) {
        clipboardParsing();
      }
    });
  } else {
    let screen_window = execFile(exPath);
    screen_window.on("exit", (code) => {
      if (code) {
        clipboardParsing();
      }
    });
  }
};
