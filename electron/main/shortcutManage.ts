import { globalShortcut } from "electron";
import { toggleDevTools } from "./windowManage";

export const registerShortcuts = () => {
  globalShortcut.register("CmdOrCtrl+F12", toggleDevTools);
};

export const unregisterShortcuts = () => {
  globalShortcut.unregisterAll();
};
