import { t } from "i18next";
import { create } from "zustand";

import { BusinessUserInfo, getBusinessUserInfo } from "@/api/login";
import { IMSDK } from "@/layout/MainContentWrap";
import router from "@/routes";
import { feedbackToast } from "@/utils/common";
import { clearIMProfile, getLocale, setLocale } from "@/utils/storage";

import { useContactStore } from "./contact";
import { useConversationStore } from "./conversation";
import { AppConfig, AppSettings, IMConnectState, UserStore } from "./type";

export const useUserStore = create<UserStore>()((set, get) => ({
  syncState: "success",
  progress: 0,
  reinstall: true,
  isLogining: false,
  connectState: "success",
  selfInfo: {} as BusinessUserInfo,
  appConfig: {} as AppConfig,
  appSettings: {
    locale: getLocale(),
    closeAction: "miniSize",
  },
  updateSyncState: (syncState: IMConnectState) => {
    set({ syncState });
  },
  updateProgressState: (progress: number) => {
    set({ progress });
  },
  updateReinstallState: (reinstall: boolean) => {
    set({ reinstall });
  },
  updateIsLogining: (isLogining: boolean) => {
    set({ isLogining });
  },
  updateConnectState: (connectState: IMConnectState) => {
    set({ connectState });
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
