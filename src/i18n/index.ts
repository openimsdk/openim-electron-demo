import "dayjs/locale/zh-cn";

import dayjs from "dayjs";
import i18n from "i18next";
// import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { getLocale } from "@/utils/storage";

import translation_en from "./resources/en.json";
import translation_zh from "./resources/zh.json";

const resources = {
  "en-US": {
    translation: translation_en,
  },
  "zh-CN": {
    translation: translation_zh,
  },
  zh: {
    translation: translation_zh,
  },
};

i18n
  .use(initReactI18next)
  // .use(LanguageDetector)
  .init({
    resources,
    lng: getLocale(),
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: false,
    },
  })
  .then(() => dayjs.locale(i18n.language))
  .catch(() => console.error("i18n init error"));

i18n.on("languageChanged", () => dayjs.locale(i18n.language));

export default i18n;
