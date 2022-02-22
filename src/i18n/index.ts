import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { getLanguage } from '../config';
import translation_en from './en.json';
import translation_zh from './zh.json';

const resources = {
    en: {
        translation: translation_en,
    },
    zh: {
        translation: translation_zh,
    },
};

i18n.use(initReactI18next).use(LanguageDetector).init({
    resources,
    lng: getLanguage(),
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
