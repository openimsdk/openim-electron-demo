import { LocaleString } from "@/store/type";
import * as localForage from "localforage";

localForage.config({
  name: "OpenCorp-Config",
});

export const setAreaCode = (areaCode: string) =>
  localStorage.setItem("IM_AREA_CODE", areaCode);
export const setPhoneNumber = (account: string) =>
  localStorage.setItem("IM_PHONE_NUM", account);
export const setEmail = (email: string) => localStorage.setItem("IM_EMAIL", email);
export const setLoginMethod = (method: string) =>
  localStorage.setItem("IM_LOGIN_METHOD", method);
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

export const getAreaCode = () => localStorage.getItem("IM_AREA_CODE");
export const getPhoneNumber = () => localStorage.getItem("IM_PHONE_NUM");
export const getEmail = () => localStorage.getItem("IM_EMAIL");
export const getLoginMethod = () =>
  (localStorage.getItem("IM_LOGIN_METHOD") ?? "phone") as "phone" | "email";
export const getIMToken = async () => await localForage.getItem("IM_TOKEN");
export const getChatToken = async () => await localForage.getItem("IM_CHAT_TOKEN");
export const getIMUserID = async () => await localForage.getItem("IM_USERID");

export const getLocale = (): LocaleString =>
  window.electronAPI?.ipcSendSync("getKeyStoreSync", { key: "language" }) ||
  (localStorage.getItem("IM_LOCALE") as LocaleString) ||
  window.navigator.language ||
  "en-US";
