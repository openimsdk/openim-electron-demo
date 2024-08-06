import { Platform } from "@openim/wasm-client-sdk";
import { useKeyPress } from "ahooks";

import win_close from "@/assets/images/topSearchBar/win_close.png";
import win_max from "@/assets/images/topSearchBar/win_max.png";
import win_min from "@/assets/images/topSearchBar/win_min.png";

const WindowControlBar = () => {
  useKeyPress("esc", () => {
    window.electronAPI?.ipcInvoke("minimizeWindow");
  });

  if (!window.electronAPI || window.electronAPI?.getPlatform() === Platform.MacOSX) {
    return null;
  }
  return (
    <div className="absolute right-3 top-3.5 z-[99999999] flex h-fit items-center">
      <div
        className="app-no-drag flex h-[14px] cursor-pointer items-center"
        onClick={() => window.electronAPI?.ipcInvoke("minimizeWindow")}
      >
        <img
          className="app-no-drag cursor-pointer"
          width={14}
          src={win_min}
          alt="win_min"
        />
      </div>
      <img
        className="app-no-drag mx-3 cursor-pointer"
        width={13}
        src={win_max}
        alt="win_max"
        onClick={() => window.electronAPI?.ipcInvoke("maxmizeWindow")}
      />
      <img
        className="app-no-drag cursor-pointer"
        width={12}
        src={win_close}
        alt="win_close"
        onClick={() => window.electronAPI?.ipcInvoke("closeWindow")}
      />
    </div>
  );
};

export default WindowControlBar;
