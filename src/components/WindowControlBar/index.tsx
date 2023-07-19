import win_close from "@/assets/images/topSearchBar/win_close.png";
import win_max from "@/assets/images/topSearchBar/win_max.png";
import win_min from "@/assets/images/topSearchBar/win_min.png";
import { Platform } from "@/utils/open-im-sdk-wasm/types/enum";

const WindowControlBar = () => {
  if (!window.electronAPI || window.electronAPI?.getPlatform() === Platform.MacOSX) {
    return null;
  }
  return (
    <div className="absolute right-3 flex h-full items-center">
      <div
        className="app-no-drag flex h-4 cursor-pointer items-center"
        onClick={() => window.electronAPI?.ipcInvoke("minimizeWindow")}
      >
        <img width={18} className="h-0.5" src={win_min} alt="win_min" />
      </div>
      <img
        className="app-no-drag mx-3 cursor-pointer"
        width={16}
        src={win_max}
        alt="win_max"
        onClick={() => window.electronAPI?.ipcInvoke("maxmizeWindow")}
      />
      <img
        className="app-no-drag cursor-pointer"
        width={16}
        src={win_close}
        alt="win_close"
        onClick={() => window.electronAPI?.ipcInvoke("closeWindow")}
      />
    </div>
  );
};

export default WindowControlBar;
