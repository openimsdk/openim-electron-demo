import { LocaleString } from "@/store/type";
import * as localForage from "localforage";

localForage.config({
  name: "OpenIM-Config",
});

export const setAccount = (account: string) =>
  localForage.setItem("IM_ACCOUNT", account);
export const setTMToken = (token: string, userID: string) =>
  localForage.setItem(userID + "IM_TOKEN", token);
export const setChatToken = (token: string, userID: string) =>
  localForage.setItem(userID + "IM_CHAT_TOKEN", token);
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
  setTMToken(imToken, userID);
  setChatToken(chatToken, userID);
  setTMUserID(userID);
};

export const setLocale = (locale: string) => localStorage.setItem("IM_LOCALE", locale);

export const clearIMProfile = (userID: string) => {
  localForage.removeItem(userID + "IM_TOKEN");
  localForage.removeItem(userID + "IM_CHAT_TOKEN");
  localForage.removeItem("IM_USERID");
};

export const getIMToken = async (userID: string) =>
  await localForage.getItem(userID + "IM_TOKEN");
export const getChatToken = async (userID: string) =>
  await localForage.getItem(userID + "IM_CHAT_TOKEN");
export const getIMUserID = async () => await localForage.getItem("IM_USERID");

export const getLocale = (): LocaleString =>
  (localStorage.getItem("IM_LOCALE") as LocaleString) || "zh-CN";
