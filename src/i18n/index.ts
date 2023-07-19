import "dayjs/locale/zh-cn";

import dayjs from "dayjs";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { getLocale } from "@/utils/storage";

import translation_en from "./resources/en.json";
import translation_zh from "./resources/zh.json";

const resources = {
  en: {
    translation: translation_en,
  },
  "zh-CN": {
    translation: translation_zh,
  },
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    lng: getLocale(),
    interpolation: {
      escapeValue: false,
    },
  })
  .then(() => {
    dayjs.locale(i18n.language);
  })
  .catch(() => console.log("i18n init error"));

export default i18n;
