import { getSDK } from "@openim/wasm-client-sdk";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useUserStore } from "@/store";
import emitter from "@/utils/events";
import { getIMToken, getIMUserID } from "@/utils/storage";

const isElectronProd = import.meta.env.MODE !== "development" && window.electronAPI;

export const IMSDK = getSDK({
  coreWasmPath: "./openIM.wasm",
  sqlWasmPath: `${isElectronProd ? ".." : ""}/sql-wasm.wasm`,
});

export const MainContentWrap = () => {
  const updateAppSettings = useUserStore((state) => state.updateAppSettings);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loginCheck = async () => {
      const IMToken = await getIMToken();
      const IMUserID = await getIMUserID();
      if (!IMToken || !IMUserID) {
        navigate("/login");
        return;
      }
    };

    loginCheck();
  }, [location.pathname]);

  useEffect(() => {
    window.userClick = (userID?: string) => {
      emitter.emit("OPEN_USER_CARD", {
        userID,
        isSelf: userID === useUserStore.getState().selfInfo.userID,
      });
    };
  }, []);

  useEffect(() => {
    const initSettingStore = async () => {
      if (!window.electronAPI) return;
      updateAppSettings({
        closeAction:
          (await window.electronAPI?.ipcInvoke("getKeyStore", {
            key: "closeAction",
          })) || "quit",
      });
      window.electronAPI?.ipcInvoke("main-win-ready");
    };

    initSettingStore();
  }, []);

  return <Outlet />;
};
