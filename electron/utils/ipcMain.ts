import { app, ipcMain } from "electron";
import { win } from "../main";
import { setTrayTitle } from "./tray";
import { screenshot } from "./srcShot"


ipcMain.on("FocusHomePage",(e)=>{
    win?.show();
})

ipcMain.on("UnReadChange",(e,num)=>{
    app.setBadgeCount(num)
    setTrayTitle(num)
})

ipcMain.on("MiniSizeApp",(e)=>{
    if(win?.isMinimized()){
        win.restore();
    }else{
        win?.minimize();
    }
})

ipcMain.on("MaxSizeApp",(e)=>{
    if(win?.isMaximized()){
        win.unmaximize();
    }else{
        win?.maximize();
    }
})

ipcMain.on("CloseApp",(e)=>{
    app.quit();
})

ipcMain.on("Screenshot",e=>{
    e.returnValue = screenshot()
})