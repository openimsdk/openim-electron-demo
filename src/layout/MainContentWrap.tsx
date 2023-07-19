import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useConversationStore, useUserStore } from "@/store";
import emitter from "@/utils/events";
import { getSDK } from "@/utils/open-im-sdk-wasm";
import { AllowType } from "@/utils/open-im-sdk-wasm/types/enum";
import { getIMToken, getIMUserID } from "@/utils/storage";

export const IMSDK = getSDK("./openIM.wasm");

export const MainContentWrap = () => {
  const selfID = useUserStore((state) => state.selfInfo.userID);
  const updateAppSettings = useUserStore((state) => state.updateAppSettings);
  const getAppConfigByReq = useUserStore((state) => state.getAppConfigByReq);

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
    window.userClick = (userID: string, groupID: string) => {
      if (!userID || userID === "AtAllTag") return;

      const currentGroupInfo = useConversationStore.getState().currentGroupInfo;

      if (groupID && currentGroupInfo?.lookMemberInfo === AllowType.NotAllowed) {
        return;
      }

      emitter.emit("OPEN_USER_CARD", {
        userID,
        groupID,
        isSelf: userID === selfID,
        notAdd:
          Boolean(groupID) &&
          currentGroupInfo?.applyMemberFriend === AllowType.NotAllowed,
      });
    };
  }, [selfID]);

  useEffect(() => {
    const initSettingStore = async () => {
      if (!window.electronAPI) return;
      updateAppSettings({
        closeAction:
          (await window.electronAPI?.ipcInvoke("getKeyStore", {
            key: "closeAction",
          })) || "miniSize",
      });
    };

    initSettingStore();
    getAppConfigByReq();
  }, []);

  return <Outlet />;
};
