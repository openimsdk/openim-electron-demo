import { t } from "i18next";
import { create } from "zustand";

import { BusinessUserInfo, getAppConfig, getBusinessUserInfo } from "@/api/login";
import { IMSDK } from "@/layout/MainContentWrap";
import router from "@/routes";
import { feedbackToast } from "@/utils/common";
import { clearIMProfile, getLocale, setLocale } from "@/utils/storage";

import { useContactStore } from "./contact";
import { useConversationStore } from "./conversation";
import { AppConfig, AppSettings, UserStore } from "./type";

export const useUserStore = create<UserStore>()((set, get) => ({
  selfInfo: {} as BusinessUserInfo,
  appConfig: {} as AppConfig,
  appSettings: {
    locale: getLocale(),
    closeAction: "miniSize",
  },
  getSelfInfoByReq: async () => {
    try {
      const { data } = await IMSDK.getSelfUserInfo<BusinessUserInfo>();
      const {
        data: { users },
      } = await getBusinessUserInfo([data.userID], true);
      const bussinessData = users[0];
      set(() => ({ selfInfo: bussinessData }));
    } catch (error) {
      feedbackToast({ error, msg: t("toast.getSelfInfoFailed") });
    }
  },
  updateSelfInfo: (info: Partial<BusinessUserInfo>) => {
    set((state) => ({ selfInfo: { ...state.selfInfo, ...info } }));
  },
  getAppConfigByReq: async () => {
    let config = {} as AppConfig;
    try {
      const { data } = await getAppConfig();
      config = data.config ?? {};
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
  userLogout: async () => {
    console.log("call userLogout:::");

    await IMSDK.logout();
    const userID = get().selfInfo.userID;
    clearIMProfile(userID);
    set({ selfInfo: {} as BusinessUserInfo });
    useContactStore.getState().clearContactStore();
    useConversationStore.getState().clearConversationStore();
    router.navigate("/login");
  },
}));
