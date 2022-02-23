import { app, BrowserWindow, Menu, session } from "electron";
import * as path from "path";
import * as isDev from "electron-is-dev";
import { initLocalWs, killLocalWs, setTray } from "./utils";
import "./utils/ipcMain";
import { setAppStatus } from "./store";

export let win: BrowserWindow | null = null;

async function createWindow() {
  Menu.setApplicationMenu(null);
  win = new BrowserWindow({
    width: 980,
    height: 735,
    minWidth: 980,
    minHeight: 735,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "./preload/api.js"),
    },
    frame: false,
    // resizable:false,
    titleBarStyle: "hidden",
  });

  setTray(win);

  if (isDev) {
    win.loadURL("http://localhost:3000");
  } else {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  }

  win.on("closed", () => (win = null));

  // Hot Reloading
  if (isDev) {
    const electronPath = path.join(__dirname, "..", "..", "node_modules", "electron", "dist", "electron");
    try {
      require("electron-reload")(__dirname, {
        electron: electronPath,
        forceHardReset: true,
        hardResetMethod: "exit",
      });
    } catch (_) {}
  }

  //  Download
  session.defaultSession.on("will-download", (event, item, webContents) => {
    item.on("done",(ev,state) => {
      webContents.send("DownloadFinish",state)
    })
  });

  // DevTools
  if (isDev) {
    win.webContents.openDevTools({
      mode: "detach",
    });
  }

  // localWs
  await initLocalWs();
  setAppStatus(true);
}
// ipcMain.on('login-resize',()=>{
//   win!.setSize(1050, 700)
// })

app.setAppUserModelId("OpenIM");

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }else{
    win.show()
  }
});

app.on("quit", () => {
  setAppStatus(false);
  killLocalWs();
});
