import { LocaleString } from "@/store/type";
import * as localForage from "localforage";

localForage.config({
  name: "OpenIM-Config",
});

export const setAccount = (account: string) =>
  localForage.setItem("IM_ACCOUNT", account);
export const setTMToken = (token: string) => localForage.setItem("IM_TOKEN", token);
export const setChatToken = (token: string) =>
  localForage.setItem("IM_CHAT_TOKEN", token);
export const setTMUserID = (userID: string) => localForage.setItem("IM_USERID", userID);
export const setIMProfile = ({
  chatToken,
  imToken,
  userID,
}: {
  chatToken: string;
  imToken: string;
  userID: string;
}) => {
  setTMToken(imToken);
  setChatToken(chatToken);
  setTMUserID(userID);
};

export const setLocale = (locale: string) => localStorage.setItem("IM_LOCALE", locale);

export const clearIMProfile = () => {
  localForage.removeItem("IM_TOKEN");
  localForage.removeItem("IM_CHAT_TOKEN");
  localForage.removeItem("IM_USERID");
};

export const getIMToken = async () => await localForage.getItem("IM_TOKEN");
export const getChatToken = async () => await localForage.getItem("IM_CHAT_TOKEN");
export const getIMUserID = async () => await localForage.getItem("IM_USERID");

export const getLocale = (): LocaleString =>
  (localStorage.getItem("IM_LOCALE") as LocaleString) || "zh-CN";
