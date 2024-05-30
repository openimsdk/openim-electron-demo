import { t } from "i18next";
import { create } from "zustand";

import {
  BusinessAllowType,
  BusinessUserInfo,
  getAppConfig,
  getBusinessUserInfo,
} from "@/api/login";
import { IMSDK } from "@/layout/MainContentWrap";
import router from "@/routes";
import { feedbackToast } from "@/utils/common";
import { clearIMProfile, getLocale, setLocale } from "@/utils/storage";

import { useContactStore } from "./contact";
import { useConversationStore } from "./conversation";
import { AppConfig, AppSettings, IMConnectState, UserStore } from "./type";

export const useUserStore = create<UserStore>()((set, get) => ({
  syncing: "success",
  selfInfo: {} as BusinessUserInfo,
  appConfig: {} as AppConfig,
  appSettings: {
    locale: getLocale(),
    closeAction: "miniSize",
  },
  updateSyncState: (syncing: IMConnectState) => {
    set({ syncing });
  },
  getSelfInfoByReq: () => {
    IMSDK.getSelfUserInfo()
      .then(({ data }) => {
        set(() => ({ selfInfo: data as unknown as BusinessUserInfo }));
        getBusinessUserInfo([data.userID]).then(({ data: { users } }) =>
          set((state) => ({ selfInfo: { ...state.selfInfo, ...users[0] } })),
        );
      })
      .catch((error) => {
        feedbackToast({ error, msg: t("toast.getSelfInfoFailed") });
        get().userLogout();
      });
  },
  updateSelfInfo: (info: Partial<BusinessUserInfo>) => {
    set((state) => ({ selfInfo: { ...state.selfInfo, ...info } }));
  },
  getAppConfigByReq: async () => {
    let config = {} as AppConfig;
    try {
      const { data } = await getAppConfig();
      config = data.config ?? {};
      if (!config.allowSendMsgNotFriend) {
        config.allowSendMsgNotFriend = BusinessAllowType.Allow;
      }
      if (!config.needInvitationCodeRegister) {
        config.needInvitationCodeRegister = BusinessAllowType.Allow;
      }
    } catch (error) {
      console.error("get app config err");
    }
    set((state) => ({ appConfig: { ...state.appConfig, ...config } }));
  },
  updateAppSettings: (settings: Partial<AppSettings>) => {
    if (settings.locale) {
      setLocale(settings.locale);
    }
    set((state) => ({ appSettings: { ...state.appSettings, ...settings } }));
  },
  userLogout: async (force = false) => {
    if (!force) await IMSDK.logout();
    clearIMProfile();
    set({ selfInfo: {} as BusinessUserInfo });
    useContactStore.getState().clearContactStore();
    useConversationStore.getState().clearConversationStore();
    window.electronAPI?.ipcInvoke("updateUnreadCount", 0);
    router.navigate("/login");
  },
}));
