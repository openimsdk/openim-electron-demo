import i18n from "i18next";
import Backend from "i18next-fs-backend";
import { join } from "node:path";

import { getStore } from "../main/storeManage";
import { app } from "electron";

const store = getStore();

export const initI18n = async () => {
  const systemLanguage = app.getLocale();
  const language = store.get("language", systemLanguage) as string;

  console.log(language);

  await i18n.use(Backend).init({
    lng: language,
    fallbackLng: "en-US",
    backend: {
      loadPath: join(__dirname, `/resources/{{lng}}.js`),
    },
  });
};

export const changeLanguage = i18n.changeLanguage;
